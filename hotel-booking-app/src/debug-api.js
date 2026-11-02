// Debug script to test API responses
import { getHotels, getHotelByID } from './Service/HotelService.js';

(async () => {
  try {
    console.log("Testing getHotels()...");
    const hotelsResponse = await getHotels();
    console.log("Full response:", hotelsResponse);
    console.log("response.data:", hotelsResponse?.data);
    console.log("Data type:", typeof hotelsResponse?.data);
    console.log("Is array?", Array.isArray(hotelsResponse?.data));
    console.log("Data length:", hotelsResponse?.data?.length);
    
    if (hotelsResponse?.data?.length > 0) {
      console.log("First hotel:", hotelsResponse.data[0]);
    }
  } catch (error) {
    console.error("Error:", error);
  }
})();
