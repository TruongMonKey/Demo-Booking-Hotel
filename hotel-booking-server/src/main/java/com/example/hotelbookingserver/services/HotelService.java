package com.example.hotelbookingserver.services;

import com.example.hotelbookingserver.entities.Amenity;
import com.example.hotelbookingserver.entities.Hotel;
import com.example.hotelbookingserver.entities.Image;
import com.example.hotelbookingserver.entities.Reviews;
import com.example.hotelbookingserver.entities.RoomType;
import com.example.hotelbookingserver.repositories.AmenityRepository;
import com.example.hotelbookingserver.repositories.HotelRepository;
import com.example.hotelbookingserver.repositories.ImageRepository;
import com.example.hotelbookingserver.repositories.ReviewsRepository;
import com.example.hotelbookingserver.repositories.RoomTypeRepository;
import com.example.hotelbookingserver.utils.Utils;
import com.example.hotelbookingserver.dtos.HotelDTO;
import com.example.hotelbookingserver.dtos.ImageDTO;
import com.example.hotelbookingserver.dtos.Response;
import com.example.hotelbookingserver.dtos.ReviewsDTO;
import com.example.hotelbookingserver.dtos.RoomTypeDTO;
import com.example.hotelbookingserver.dtos.AmenityDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class HotelService implements IHotelService {

        @Autowired
        private HotelRepository hotelRepository;

        @Autowired
        private ImageRepository imageRepository;

        @Autowired
        private RoomTypeRepository roomTypeRepository;

        @Autowired
        private AmenityRepository amenityRepository;

        @Autowired
        private ReviewsRepository reviewsRepository;

        @Autowired
        private CloudinaryService cloudinaryService;

        @Override
        public Response getAllHotels() {
                Response response = new Response();
                try {
                        List<HotelDTO> hotelDTOList = hotelRepository.getListHotels().stream()
                                        .map(Utils::mapHotelEntityToHotelDTO)
                                        .collect(Collectors.toList());

                        response.setStatusCode(200);
                        response.setMessage("Get hotel list successfully");
                        response.setHotelList(hotelDTOList);
                } catch (Exception e) {
                        response.setStatusCode(500);
                        response.setMessage("Error: " + e.getMessage());
                }
                return response;

        }

        @Override
        public Response getHotelById(UUID id) {
                Response response = new Response();
                try {
                        // hotelRepository.findAll().forEach(h -> System.out.println("Hotel: " +
                        // h.getId()));
                        Hotel hotel = hotelRepository.findById(id).orElse(null);

                        if (hotel == null) {
                                response.setStatusCode(404);
                                response.setMessage("Hotel with ID not found: " + id);
                        } else {
                                HotelDTO hotelDTO = Utils.mapHotelEntityToHotelDTO(hotel);
                                response.setStatusCode(200);
                                response.setMessage("Hotel information successfully");
                                response.setHotelList(List.of(hotelDTO));
                        }
                } catch (Exception e) {
                        response.setStatusCode(500);
                        response.setMessage("Error: " + e.getMessage());
                }
                return response;
        }

        @Override
        public Response addHotel(HotelDTO requestDTO) {
                Response response = new Response();
                try {
                        Hotel hotel = new Hotel();
                        hotel.setName(requestDTO.getName());
                        hotel.setAddress(requestDTO.getAddress());
                        hotel.setLinkMap(requestDTO.getLinkMap());
                        hotel.setDescription(requestDTO.getDescription());
                        hotel.setRate(requestDTO.getRate());
                        hotel.setCheckInTime(requestDTO.getCheckInTime());
                        hotel.setCheckOutTime(requestDTO.getCheckOutTime());

                        if (requestDTO.getThumbnail() != null && !requestDTO.getThumbnail().isEmpty()) {
                                String thumbnailUrl = cloudinaryService.uploadToCloudinary(requestDTO.getThumbnail());
                                hotel.setThumbnail(thumbnailUrl);
                        }

                        Hotel savedHotel = hotelRepository.save(hotel);

                        List<MultipartFile> imageFiles = requestDTO.getImageFiles();
                        if (imageFiles != null && !imageFiles.isEmpty()) {
                                cloudinaryService.uploadHotelImages(imageFiles, savedHotel);
                        }
                        if (requestDTO.getRoomTypes() != null) {
                                for (RoomTypeDTO rtDTO : requestDTO.getRoomTypes()) {
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

                        if (requestDTO.getReviews() != null) {
                                for (ReviewsDTO rDTO : requestDTO.getReviews()) {
                                        Reviews review = new Reviews();
                                        review.setRating(rDTO.getRating());
                                        review.setContent(rDTO.getContent());
                                        review.setHotel(savedHotel);
                                        reviewsRepository.save(review);
                                }
                        }

                        response.setStatusCode(201);
                        response.setMessage("Add full hotel successfully");
                        response.setHotelList(List.of(Utils.mapHotelEntityToHotelDTO(savedHotel)));
                } catch (Exception e) {
                        response.setStatusCode(500);
                        response.setMessage("Error adding hotel" + e.getMessage());
                }

                return response;
        }
}
