import { post } from '../utils/request'

/**
 * Book a room for a user
 * @param {Object} options - Booking details (checkInDate, checkOutDate, numberOfRooms, etc.)
 * @returns {Promise} Response from booking API
 */
export const bookRoom = async (options) => {
    return await post(`api/bookings`, options);
}