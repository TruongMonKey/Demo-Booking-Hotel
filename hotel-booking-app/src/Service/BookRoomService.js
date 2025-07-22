import { post } from '../utils/request'

export const bookRoom =async (roomid, userid, options)=> {
    return await post(`bookings/book-room/${roomid}/${userid}`,options);
}