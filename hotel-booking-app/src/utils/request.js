const baseURL = "http://localhost:8081/"

function getToken() {
    return localStorage.getItem("accessToken");
}

async function checkResponse(response) {
    if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = `HTTP error! status: ${response.status}`;
        if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.message || JSON.stringify(errorData);
        } else {
            const text = await response.text();
            if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json();
    }
    return null;
}

function buildHeaders(extra) {
    const token = getToken();
    let headers = { 'Content-Type': 'application/json', ...extra };
    if(token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
}

export async function post(url, data) {
    const response = await fetch(baseURL + url, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(data),
    });
    return checkResponse(response);
}

export async function get(url) {
    const response = await fetch(baseURL + url, {
        method: 'GET',
        headers: buildHeaders()
    });
    return checkResponse(response);
}

export async function del(url) {
    const response = await fetch(baseURL + url, {
        method: 'DELETE',
        headers: buildHeaders()
    });
    return checkResponse(response);
}

export async function patch(url, data) {
    const response = await fetch(baseURL + url, {
        method: 'PATCH',
        headers: buildHeaders(),
        body: JSON.stringify(data),
    });
    return checkResponse(response);
}

export async function put(url, data) {
    const response = await fetch(baseURL + url, {
        method: 'PUT',
        headers: buildHeaders(),
        body: JSON.stringify(data),
    });
    return checkResponse(response);
}