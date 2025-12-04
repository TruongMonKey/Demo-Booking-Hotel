// src/Service/UserServices.js
import { post, get, del, patch, put } from "../utils/request";

/**
 * Helper unwrap response.data (supports both axios-like and direct fetch-like returns)
 */
const unwrap = (resp) => {
  if (!resp) return resp;
  return resp?.data ?? resp;
};

const handleError = (err) => {
  // Nếu axios error, try extract useful info
  const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
  const status = err?.response?.status;
  const msg = serverMsg || err.message || "Unknown error";
  const e = new Error(msg);
  e.status = status;
  throw e;
};

// ================= USER AUTH =================
export const createUser = async (options) => {
  try {
    const resp = await post("auth/register", options);
    return unwrap(resp);
  } catch (err) {
    handleError(err);
  }
};

export const login = async (options) => {
  try {
    const resp = await post("auth/login", options);
    const data = unwrap(resp);

    // normalize token field names to accessToken and user
    const token = data?.accessToken ?? data?.access_token ?? data?.access_token;
    // put token into the normalized object
    return {
      ...data,
      accessToken: token,
    };
  } catch (err) {
    handleError(err);
  }
};

// ================= USER CRUD =================
export const getAllUser = async () => {
  try {
    const resp = await get("api/v1/users");
    return unwrap(resp);
  } catch (err) {
    handleError(err);
  }
};

export const getUserById = async (id) => {
  try {
    const resp = await get(`api/v1/users/${id}`);
    return unwrap(resp);
  } catch (err) {
    handleError(err);
  }
};

export const delUserById = async (id) => {
  try {
    const resp = await del(`api/v1/users/${id}`);
    return unwrap(resp);
  } catch (err) {
    handleError(err);
  }
};

export const updateRole = async (id, options) => {
  try {
    const resp = await put(`api/v1/users/${id}`, options);
    return unwrap(resp);
  } catch (err) {
    handleError(err);
  }
};

export const editRoom = async (id, options) => {
  try {
    const resp = await put(`roomtypes/update/${id}`, options);
    return unwrap(resp);
  } catch (err) {
    handleError(err);
  }
};
