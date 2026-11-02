package com.example.hotelbookingserver.services;

import com.example.hotelbookingserver.entities.Amenity;
import com.example.hotelbookingserver.entities.Hotel;
import com.example.hotelbookingserver.entities.Reviews;
import com.example.hotelbookingserver.entities.RoomType;
import com.example.hotelbookingserver.repositories.AmenityRepository;
import com.example.hotelbookingserver.repositories.BookingRepository;
import com.example.hotelbookingserver.repositories.HotelRepository;
import com.example.hotelbookingserver.repositories.ImageRepository;
import com.example.hotelbookingserver.repositories.ReviewsRepository;
import com.example.hotelbookingserver.repositories.RoomTypeRepository;
import com.example.hotelbookingserver.services.impl.IHotelService;
import com.example.hotelbookingserver.utils.Utils;
import com.example.hotelbookingserver.dtos.responses.AmenityDTO;
import com.example.hotelbookingserver.dtos.responses.HotelResponseDTO;
import com.example.hotelbookingserver.dtos.responses.Response;
import com.example.hotelbookingserver.dtos.responses.ReviewResponseDTO;
import com.example.hotelbookingserver.dtos.responses.RoomTypeResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class HotelService implements IHotelService {

        private static final Logger logger = LoggerFactory.getLogger(HotelService.class);

        @Autowired
        private HotelRepository hotelRepository;

        @Autowired
        private RoomTypeRepository roomTypeRepository;

        @Autowired
        private AmenityRepository amenityRepository;

        @Autowired
        private ReviewsRepository reviewsRepository;

        @Autowired
        private BookingRepository bookingRepository;

        @Autowired
        private ImageRepository imageRepository;

        @Autowired
        private ReviewsRepository reviewRepository;

        @Override
        public Response<List<HotelResponseDTO>> getAllHotels() {
                Response<List<HotelResponseDTO>> response = new Response<>();
                try {
                        List<HotelResponseDTO> hotelDTOList = hotelRepository.getListHotels().stream()
                                        .map(Utils::mapHotelEntityToHotelDTO)
                                        .collect(Collectors.toList());

                        response.setStatusCode(200);
                        response.setMessage("Get hotel list successfully");
                        response.setData(hotelDTOList);
                } catch (Exception e) {
                        response.setStatusCode(500);
                        response.setMessage("Error fetching hotels: " + e.getMessage());
                }
                return response;
        }

        @Override
        public Response<HotelResponseDTO> getHotelById(UUID id) {
                Response<HotelResponseDTO> response = new Response<>();
                try {
                        Hotel hotel = hotelRepository.findById(id).orElse(null);
                        if (hotel == null) {
                                response.setStatusCode(404);
                                response.setMessage("Hotel with ID not found: " + id);
                        } else {
                                HotelResponseDTO hotelDTO = Utils.mapHotelEntityToHotelDTO(hotel);
                                response.setStatusCode(200);
                                response.setMessage("Get hotel successfully");
                                response.setData(hotelDTO);
                        }
                } catch (Exception e) {
                        response.setStatusCode(500);
                        response.setMessage("Error: " + e.getMessage());
                }
                return response;
        }

        @Override
        @Transactional
        public Response<HotelResponseDTO> addHotel(HotelResponseDTO requestDTO) {
                Response<HotelResponseDTO> response = new Response<>();
                try {
                        Hotel hotel = new Hotel();
                        hotel.setName(requestDTO.getName());
                        hotel.setAddress(requestDTO.getAddress());
                        hotel.setLinkMap(requestDTO.getLinkMap());
                        hotel.setDescription(requestDTO.getDescription());
                        if (requestDTO.getRate() != null) {
                                hotel.setRate(requestDTO.getRate().floatValue());
                        }
                        hotel.setCheckInTime(requestDTO.getCheckInTime());
                        hotel.setCheckOutTime(requestDTO.getCheckOutTime());

                        // Use thumbnailUrl string directly if provided
                        if (requestDTO.getThumbnailUrl() != null) {
                                hotel.setThumbnail(requestDTO.getThumbnailUrl());
                        }

                        Hotel savedHotel = hotelRepository.save(hotel);

                        // Upload room types + amenities
                        if (requestDTO.getRoomTypes() != null) {
                                for (RoomTypeResponseDTO rtDTO : requestDTO.getRoomTypes()) {
                                        RoomType roomType = new RoomType();
                                        roomType.setName(rtDTO.getName());
                                        roomType.setQuantityBed(rtDTO.getQuantityBed());
                                        roomType.setQuantityPeople(rtDTO.getQuantityPeople());
                                        roomType.setRoomArea(rtDTO.getRoomArea());
                                        roomType.setQuantityRoom(rtDTO.getQuantityRoom());
                                        roomType.setPrice(rtDTO.getPrice());
                                        roomType.setHotel(savedHotel);

                                        RoomType savedRoomType = roomTypeRepository.save(roomType);

                                        if (rtDTO.getAmenities() != null) {
                                                for (AmenityDTO amenityDTO : rtDTO.getAmenities()) {
                                                        Amenity amenity = new Amenity();
                                                        amenity.setName(amenityDTO.getName());
                                                        amenity.setRoomType(savedRoomType);
                                                        amenityRepository.save(amenity);
                                                }
                                        }
                                }
                        }

                        // Upload reviews
                        if (requestDTO.getReviews() != null) {
                                for (ReviewResponseDTO rDTO : requestDTO.getReviews()) {
                                        Reviews review = new Reviews();
                                        review.setRating(rDTO.getRating());
                                        review.setContent(rDTO.getContent());
                                        review.setHotel(savedHotel);
                                        reviewsRepository.save(review);
                                }
                        }

                        response.setStatusCode(201);
                        response.setMessage("Add full hotel successfully");
                        response.setData(Utils.mapHotelEntityToHotelDTO(savedHotel));

                } catch (Exception e) {
                        response.setStatusCode(500);
                        response.setMessage("Error adding hotel: " + e.getMessage());
                }

                return response;
        }

        @Override
        @Transactional
        public Response<HotelResponseDTO> updateHotel(UUID hotelId, HotelResponseDTO requestDTO) {
                Response<HotelResponseDTO> response = new Response<>();
                try {
                        Hotel hotel = hotelRepository.findById(hotelId)
                                        .orElseThrow(() -> new RuntimeException("Hotel Not Found"));

                        if (requestDTO.getName() != null)
                                hotel.setName(requestDTO.getName());
                        if (requestDTO.getAddress() != null)
                                hotel.setAddress(requestDTO.getAddress());
                        if (requestDTO.getDescription() != null)
                                hotel.setDescription(requestDTO.getDescription());
                        if (requestDTO.getLinkMap() != null)
                                hotel.setLinkMap(requestDTO.getLinkMap());
                        if (requestDTO.getRate() != null)
                                hotel.setRate(requestDTO.getRate().floatValue());
                        if (requestDTO.getCheckInTime() != null)
                                hotel.setCheckInTime(requestDTO.getCheckInTime());
                        if (requestDTO.getCheckOutTime() != null)
                                hotel.setCheckOutTime(requestDTO.getCheckOutTime());
                        if (requestDTO.getThumbnailUrl() != null) {
                                hotel.setThumbnail(requestDTO.getThumbnailUrl());
                        }

                        Hotel updatedHotel = hotelRepository.save(hotel);
                        response.setStatusCode(200);
                        response.setMessage("Update hotel successfully");
                        response.setData(Utils.mapHotelEntityToHotelDTO(updatedHotel));
                } catch (Exception e) {
                        response.setStatusCode(500);
                        response.setMessage("Error updating hotel: " + e.getMessage());
                }
                return response;
        }

        @Override
        @Transactional
        public Response<Void> deleteHotel(UUID hotelId) {
                Response<Void> response = new Response<>();
                try {
                        Hotel hotel = hotelRepository.findById(hotelId)
                                        .orElseThrow(() -> new RuntimeException("Hotel Not Found"));

                        bookingRepository.deleteByHotelId(hotelId);
                        roomTypeRepository.deleteByHotelId(hotelId);
                        imageRepository.deleteByHotelId(hotelId);
                        reviewRepository.deleteByHotelId(hotelId);

                        hotelRepository.delete(hotel);

                        response.setStatusCode(200);
                        response.setMessage("Delete hotel successfully");
                        response.setData(null);
                        return response;
                } catch (Exception e) {
                        logger.error("Error deleting hotel {}: {}", hotelId, e.getMessage(), e);
                        response.setStatusCode(500);
                        response.setMessage("Error deleting hotel: " + e.getMessage());
                        response.setData(null);
                        return response;
                }
        }
}