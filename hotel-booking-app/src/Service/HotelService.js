// src/Service/HotelService.js
import { get, post, put, del } from "../utils/request";
import { MOCK_HOTELS } from "../mock/hotelsData";

// LẤY TẤT CẢ KHÁCH SẠN
export const getHotels = async () => {
  try {
    const res = await get("hotels/all");
    const list = Array.isArray(res) ? res : (res?.data ?? []);
    if (list && list.length > 0) {
      return res;
    }
    // Nếu backend trả về rỗng, fallback về mock OTA
    return { data: MOCK_HOTELS };
  } catch (err) {
    console.warn("[HotelService] Backend unreachable, using OTA mock hotels data:", err.message);
    return { data: MOCK_HOTELS };
  }
};

// TÌM KHÁCH SẠN THEO ID
export const getHotelByID = async (id) => {
  try {
    const res = await get(`hotels/hotel-by-id/${id}`);
    const hotel = typeof res === "object" && res?.data ? res.data : res;
    if (hotel && hotel.id) {
      return res;
    }
    const foundMock = MOCK_HOTELS.find((h) => String(h.id) === String(id));
    if (foundMock) return { data: foundMock };
    return res;
  } catch (err) {
    console.warn(`[HotelService] Backend unreachable for hotel ${id}, searching mock:`, err.message);
    const foundMock = MOCK_HOTELS.find((h) => String(h.id) === String(id)) || MOCK_HOTELS[0];
    return { data: foundMock };
  }
};

// LẤY RATING
export const getRating = async () => {
  try {
    const res = await get("hotels/all");
    return res.data;
  } catch (err) {
    return MOCK_HOTELS;
  }
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
