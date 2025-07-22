import { get, post } from '../utils/request'

export const getHotels = async () =>{
    return await get(`hotels/all`);
}

export const getHotelByID = async (id) =>{
    return await get(`hotels/hotel-by-id/${id}`);
}

export const getRating = async () =>{
    return await get(`hotels`);
}

export const createHotel = async (option) => {
    return await post(`hotels/add`, option);
}

