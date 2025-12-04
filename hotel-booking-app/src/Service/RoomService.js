import { post, get, del, patch, put } from "../utils/request";

export const createRoom = async (options) => {
    return await post('roomtypes/add', options);
};

export const getRoomById = async (id) => {
    return await get(`roomtypes/room-by-id/${id}`);
};

export const deleteRoom = async (id) => {
    return await del(`roomtypes/delete/${id}`);
};

export const editRoom = async (id, options) => {
    return await put(`roomtypes/update/${id}`, options);
};


export const editHotel = async (id,options) => {
    return await put(`hotels/update/${id}`, options);
};

export const createAmenities = async (options) => {
    return await post('api/amenities/create', options);
};