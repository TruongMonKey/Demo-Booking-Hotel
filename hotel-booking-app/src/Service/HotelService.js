// src/services/hotel.js
import { get, post, put, del } from "../utils/request";

// LẤY TẤT CẢ KHÁCH SẠN
export const getHotels = async () => {
  const res = await get("hotels/all");
  return res; // <-- Trả về full response object với data field
};

// TÌM KHÁCH SẠN THEO ID
export const getHotelByID = async (id) => {
  const res = await get(`hotels/hotel-by-id/${id}`);
  return res; // <-- Trả về full response object với data field
};

// LẤY RATING (backend hiện không có endpoint /hotels cho rating)
export const getRating = async () => {
  const res = await get("hotels/all");
  return res.data;
};

// THÊM KHÁCH SẠN (multipart/form-data)
export const createHotel = async (formData) => {
  return await post("hotels/add", formData);
};

// UPDATE KHÁCH SẠN (multipart/form-data)
export const updateHotel = async (id, formData) => {
  return await put(`hotels/update/${id}`, formData);
};

// XOÁ KHÁCH SẠN
export const deleteHotel = async (id) => {
  return await del(`hotels/delete/${id}`);
};
