// src/utils/request.js
// Improved request helper with token refresh + queueing, CORS-friendly options, and robust logging.

const baseURL = "http://localhost:8081"; // no trailing slash

// trạng thái refresh chung
let isRefreshing = false;
let refreshPromise = null;
let queuedRequests = [];

/**
 * Get stored access token (may be null)
 */
function getToken() {
  try {
    return localStorage.getItem("accessToken");
  } catch (e) {
    console.error("[getToken] localStorage error", e);
    return null;
  }
}

/**
 * Normalize JSON response and throw for non-ok statuses.
 */
async function checkResponse(response) {
  console.debug(`[checkResponse] HTTP ${response.status} ${response.url}`);

  const contentType = response.headers.get("content-type") || "";

  const parseBody = async () => {
    if (contentType.includes("application/json")) {
      try {
        return await response.json();
      } catch (e) {
        return null;
      }
    } else {
      try {
        return await response.text();
      } catch (e) {
        return null;
      }
    }
  };

  const body = await parseBody();

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;
    if (body) {
      if (typeof body === "string") errorMessage = body;
      else if (body.message) errorMessage = body.message;
      else errorMessage = JSON.stringify(body);
    }
    const err = new Error(errorMessage);
    err.status = response.status;
    err.body = body;
    throw err;
  }

  return body;
}

/**
 * Build headers; can accept an explicit token override (useful for retry).
 * hasBody -> set Content-Type
 */
function buildHeaders(hasBody = false, extra = {}, tokenOverride = null) {
  const token = tokenOverride ?? getToken();
  const headers = { ...extra };
  headers["Accept"] = headers["Accept"] || "application/json";
  if (hasBody) headers["Content-Type"] = headers["Content-Type"] || "application/json";
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    console.debug("[buildHeaders] No access token available when building headers");
  }
  return headers;
}

/**
 * Normalize URL joining baseURL + url
 */
function buildFullUrl(url) {
  if (!url) return baseURL;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  // ensure single slash between baseURL and url
  return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
}

/**
 * Call backend refresh endpoint. Ensure only one refresh request occurs at a time.
 * Returns a promise that resolves with the new accessToken (string) or rejects.
 */
function refreshToken() {
  // If a refresh is already in progress, return the same promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      console.debug("[refreshToken] Calling refresh token endpoint...");
      const resp = await fetch(buildFullUrl("auth/refresh"), {
        method: "GET",
        credentials: "include", // important to send refresh_token cookie
        headers: {
          Accept: "application/json",
        },
      });

      if (!resp.ok) {
        let errBody = null;
        try {
          const ctype = resp.headers.get("content-type") || "";
          errBody = ctype.includes("application/json") ? await resp.json().catch(() => null) : await resp.text().catch(() => null);
        } catch (e) {
          errBody = null;
        }
        const err = new Error("Refresh failed");
        err.status = resp.status;
        err.body = errBody;
        throw err;
      }

      const body = await resp.json().catch(() => null);
      const newAccess = body?.accessToken ?? body?.access_token;
      if (!newAccess) {
        throw new Error("Refresh endpoint did not return access token");
      }

      try {
        localStorage.setItem("accessToken", newAccess);
      } catch (e) {
        console.error("[refreshToken] error saving new token", e);
      }

      console.debug("[refreshToken] refresh succeeded, new token saved");
      return newAccess;
    } finally {
      // reset flags after the promise settles
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Queue a request while refresh is happening.
 * cb receives the new token (string) when refresh succeeds and should return a Promise that resolves to the response body.
 */
function enqueueRequest(cb) {
  return new Promise((resolve, reject) => {
    queuedRequests.push({ cb, resolve, reject });
  });
}

/**
 * Process queued requests after refresh outcome
 */
function processQueue(success, newToken, error) {
  queuedRequests.forEach(({ cb, resolve, reject }) => {
    if (success) {
      try {
        // cb may return a Promise
        Promise.resolve(cb(newToken)).then(resolve).catch(reject);
      } catch (e) {
        reject(e);
      }
    } else {
      reject(error);
    }
  });
  queuedRequests = [];
}

/**
 * Core helper: performs fetch with auth headers, handles 401 by attempting refresh once and retrying.
 * options: { method, url, body, extraHeaders, retry } retry flag prevents infinite loop
 */
async function fetchWithAuth({ method = "GET", url, body = null, extraHeaders = {}, retry = true }) {
  const fullUrl = buildFullUrl(url);
  const hasBody = body !== null && body !== undefined;
  const headers = buildHeaders(hasBody, extraHeaders);

  const fetchOptions = {
    method,
    headers,
    credentials: "include", // always include cookies for refresh flow
  };
  if (hasBody) fetchOptions.body = JSON.stringify(body);

  console.debug("[fetchWithAuth] Request:", method, fullUrl);
  console.debug("[fetchWithAuth] Options:", { ...fetchOptions, body: hasBody ? body : undefined });

  // First attempt
  let response;
  try {
    response = await fetch(fullUrl, fetchOptions);
  } catch (err) {
    console.error("[fetchWithAuth] network/fetch error:", err);
    throw new Error(`Network error: ${err?.name ?? ""} ${err?.message ?? err}`);
  }

  // If unauthorized -> try refresh
  if (response.status === 401 && retry) {
    console.debug(`[fetchWithAuth] Request ${method} ${url} returned 401 — handling refresh flow`);

    // determine whether another request already started the refresh BEFORE we called refreshToken()
    const wasRefreshing = isRefreshing;
    const newTokenPromise = refreshToken();

    // If a refresh was already in progress when we began, enqueue and wait for the queued result
    if (wasRefreshing) {
      console.debug("[fetchWithAuth] Refresh already in progress; enqueuing request");
      return enqueueRequest(async (token) => {
        // Build headers using provided token to be safe
        const retryHeaders = buildHeaders(hasBody, extraHeaders, token);
        const retryOptions = { method, headers: retryHeaders, credentials: "include" };
        if (hasBody) retryOptions.body = JSON.stringify(body);

        let retryResp;
        try {
          retryResp = await fetch(fullUrl, retryOptions);
        } catch (err) {
          throw new Error(`Network error (retry): ${err?.message ?? err}`);
        }

        if (retryResp.status === 401) {
          const err = new Error("Unauthorized after refresh");
          err.status = 401;
          throw err;
        }
        return checkResponse(retryResp);
      });
    }

    // We are the initiator of the refresh flow
    try {
      const newToken = await newTokenPromise;

      // Process queued requests that were enqueued while the refresh happened
      try {
        processQueue(true, newToken, null);
      } catch (e) {
        console.warn("[fetchWithAuth] processQueue warning", e);
      }

      // Retry original request once with new token
      const retryHeaders = buildHeaders(hasBody, extraHeaders, newToken);
      const retryOptions = { method, headers: retryHeaders, credentials: "include" };
      if (hasBody) retryOptions.body = JSON.stringify(body);

      let retryResponse;
      try {
        retryResponse = await fetch(fullUrl, retryOptions);
      } catch (err) {
        throw new Error(`Network error (retry): ${err?.message ?? err}`);
      }

      if (retryResponse.status === 401) {
        const err = new Error("Unauthorized even after refresh");
        err.status = 401;
        throw err;
      }

      return checkResponse(retryResponse);
    } catch (err) {
      console.warn("[fetchWithAuth] refresh failed, rejecting queued requests and forcing logout", err);
      // refresh failed -> reject queued and force redirect to login
      try {
        processQueue(false, null, err);
      } catch (e) {
        console.error("[fetchWithAuth] processQueue error on failure", e);
      }
      try {
        localStorage.removeItem("accessToken");
      } catch (e) {
        console.error("[fetchWithAuth] Error removing token", e);
      }
      if (typeof window !== "undefined") {
        // redirect to login page (adjust path as needed)
        window.location.href = "/auth";
      }
      throw err;
    }
  }

  // Non-401: either ok or other error handled by checkResponse
  return checkResponse(response);
}

// Exposed wrappers
export async function post(url, data) {
  return fetchWithAuth({ method: "POST", url, body: data });
}

export async function get(url) {
  return fetchWithAuth({ method: "GET", url });
}

export async function del(url) {
  return fetchWithAuth({ method: "DELETE", url });
}

export async function patch(url, data) {
  return fetchWithAuth({ method: "PATCH", url, body: data });
}

export async function put(url, data) {
  return fetchWithAuth({ method: "PUT", url, body: data });
}

/**
 * Optional helper: attempt refresh once on app startup.
 */
export async function tryRefreshOnStartup() {
  try {
    const newToken = await refreshToken();
    console.debug("[tryRefreshOnStartup] got token");
    return newToken;
  } catch (err) {
    console.warn("[tryRefreshOnStartup] failed", err);
    return null;
  }
}
