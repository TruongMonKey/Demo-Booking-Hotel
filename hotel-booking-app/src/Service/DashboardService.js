import { get } from "../utils/request";

export const getStats = async () =>{
    return await get(`stats`);
}

export const getBookings = async () =>{
    return await get(`bookings/all`);
}

export const getRooms = async () =>{
    return await get(`rooms`);
}


export const getFeedback = async () =>{
    return await get(`feedback`);
}

export const getNotifications = async () =>{
    return await get(`notifications`);
}


export const getAdditionalStats = async () =>{
    return await get(`additionalStats`);
}
