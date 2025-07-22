import { post, put } from '../utils/request'

export const createAmenities =async (options)=> {
    return await post(`amenities`,options);
}

export const editAmenities =async (id, options)=> {
    return await put(`amenities/${id}`,options);
}