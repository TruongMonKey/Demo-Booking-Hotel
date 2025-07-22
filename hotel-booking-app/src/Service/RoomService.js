import { post, get, del, patch, put } from "../utils/request";

export const createRoom = async (options) => {
    return await post('rooms/add', options);
};

export const getRoomById = async (id) => {
    return await get(`rooms/room-by-id/${id}`);
};

export const deleteRoom = async (id) => {
    return await del(`rooms/delete/${id}`);
};

export const editRoom = async (id, options) => {
    return await put(`rooms/update/${id}`, options);
};


export const editHotel = async (id,options) => {
    return await put(`hotels/${id}`, options);
};