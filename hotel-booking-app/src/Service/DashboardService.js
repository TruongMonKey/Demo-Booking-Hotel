import { get } from "../utils/request";

/**
 * Lấy danh sách booking (tất cả hoặc theo filter)
 * @returns {Promise} Response từ API
 */
export const getBookings = async () =>{
    return await get(`api/bookings`);
}

/**
 * Lấy danh sách tất cả phòng
 * @returns {Promise} Response từ API
 */
export const getRooms = async () =>{
    return await get(`roomtypes/all`);
}

/**
 * Lấy danh sách tất cả hotel
 * @returns {Promise} Response từ API
 */
export const getHotels = async () =>{
    return await get(`hotels/all`);
}

/**
 * Lấy danh sách người dùng
 * @returns {Promise} Response từ API
 */
export const getUsers = async () =>{
    return await get(`api/v1/users`);
}
