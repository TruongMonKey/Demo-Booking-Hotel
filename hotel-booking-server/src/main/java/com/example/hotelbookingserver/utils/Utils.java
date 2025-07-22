package com.example.hotelbookingserver.utils;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.example.hotelbookingserver.dtos.AmenityDTO;
import com.example.hotelbookingserver.dtos.BookingDTO;
import com.example.hotelbookingserver.dtos.HotelDTO;
import com.example.hotelbookingserver.dtos.ImageDTO;
import com.example.hotelbookingserver.dtos.ReviewsDTO;
import com.example.hotelbookingserver.dtos.RoomTypeDTO;
import com.example.hotelbookingserver.dtos.UserDTO;
import com.example.hotelbookingserver.entities.Amenity;
import com.example.hotelbookingserver.entities.Booking;
import com.example.hotelbookingserver.entities.Hotel;
import com.example.hotelbookingserver.entities.Image;
import com.example.hotelbookingserver.entities.RoomType;
import com.example.hotelbookingserver.entities.User;

public class Utils {

    private static final String ALPHANUMERIC_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final SecureRandom secureRandom = new SecureRandom();

    public static UserDTO mapUserEntityToUserDTO(User user) {

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhone());
        userDTO.setRole(user.getRole());
        return userDTO;
    }

    public static BookingDTO mapBookingEntityToBookingDTO(Booking booking) {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setId(booking.getId());

        // Set userId
        if (booking.getUser() != null) {
            bookingDTO.setUserId(booking.getUser().getId());
        }

        // Set hotelId
        if (booking.getRoomType() != null) {
            bookingDTO.setRoomTypeId(booking.getRoomType().getId());
            if (booking.getRoomType().getHotel() != null) {
                bookingDTO.setHotelId(booking.getRoomType().getHotel().getId());
            }
        }

        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setStatus(booking.getStatus());

        return bookingDTO;
    }

    public static RoomTypeDTO mapRoomEntityToRoomDTO(RoomType roomType) {
        RoomTypeDTO roomTypeDTO = new RoomTypeDTO();

        roomTypeDTO.setId(roomType.getId());
        roomTypeDTO.setHotelId(roomType.getHotel().getId());
        roomTypeDTO.setName(roomType.getName());
        roomTypeDTO.setQuantityBed(roomType.getQuantityBed());
        roomTypeDTO.setQuantityPeople(roomType.getQuantityPeople());
        roomTypeDTO.setRoomArea(roomType.getRoomArea());
        roomTypeDTO.setPrice(roomType.getPrice());
        roomTypeDTO.setQuantityRoom(roomType.getQuantityRoom());

        return roomTypeDTO;
    }

    public static BookingDTO mapBookingEntityToBookingDTOPlusBookedRooms(Booking booking, boolean mapUser) {

        BookingDTO bookingDTO = new BookingDTO();

        bookingDTO.setId(booking.getId());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setStatus(booking.getStatus());
        if (mapUser) {
            bookingDTO.setUser(Utils.mapUserEntityToUserDTO(booking.getUser()));
        }
        if (booking.getRoomType() != null) {
            RoomType room = booking.getRoomType();
            RoomTypeDTO roomDTO = new RoomTypeDTO();

            roomDTO.setId(booking.getRoomType().getId());
            roomDTO.setName(booking.getRoomType().getName());
            roomDTO.setQuantityBed(booking.getRoomType().getQuantityBed());
            roomDTO.setQuantityPeople(booking.getRoomType().getQuantityPeople());
            roomDTO.setRoomArea(booking.getRoomType().getRoomArea());
            roomDTO.setQuantityRoom(booking.getRoomType().getQuantityRoom());
            roomDTO.setPrice(booking.getRoomType().getPrice());

            bookingDTO.setHotelId(room.getHotel().getId());
            System.out.println("Hotel ID: " + bookingDTO.getHotelId());

            if (room.getAmenities() != null && !room.getAmenities().isEmpty()) {
                roomDTO.setAmenities(
                        room.getAmenities().stream().map(amenity -> {
                            AmenityDTO amenityDTO = new AmenityDTO();
                            amenityDTO.setId(amenity.getId());
                            amenityDTO.setName(amenity.getName());
                            return amenityDTO;
                        }).collect(Collectors.toList()));
            }

            bookingDTO.setRoom(roomDTO);
        }
        return bookingDTO;
    }

    public static UserDTO mapUserEntityToUserDTOPlusUserBookingsAndRoom(User user) {
        UserDTO userDTO = new UserDTO();

        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhone());
        userDTO.setRole(user.getRole());

        if (user.getBookings() != null && !user.getBookings().isEmpty()) {
            userDTO.setBookings(
                    user.getBookings().stream()
                            .map((Booking booking) -> mapBookingEntityToBookingDTOPlusBookedRooms(booking, false))
                            .collect(Collectors.toList()));
        }
        return userDTO;
    }

    public static List<RoomTypeDTO> mapRoomListEntityToRoomListDTO(List<RoomType> roomList) {
        return roomList.stream().map(Utils::mapRoomEntityToRoomDTO).collect(Collectors.toList());
    }

    public static List<BookingDTO> mapBookingListEntityToBookingListDTO(List<Booking> bookingList) {
        return bookingList.stream().map(Utils::mapBookingEntityToBookingDTO).collect(Collectors.toList());
    }

    public static RoomTypeDTO mapRoomEntityToRoomDTOPlusBookings(RoomType room) {
        RoomTypeDTO roomDTO = new RoomTypeDTO();

        roomDTO.setId(room.getId());
        roomDTO.setName(room.getName());
        roomDTO.setQuantityBed(room.getQuantityBed());
        roomDTO.setQuantityPeople(room.getQuantityPeople());
        roomDTO.setRoomArea(room.getRoomArea());
        roomDTO.setQuantityRoom(room.getQuantityRoom());
        roomDTO.setPrice(room.getPrice());
        if (room.getHotel() != null) {
            roomDTO.setHotelId(room.getHotel().getId());
        }

        if (room.getBookings() != null) {
            roomDTO.setBookings(
                    room.getBookings().stream().map(Utils::mapBookingEntityToBookingDTO).collect(Collectors.toList()));
        }
        if (room.getAmenities() != null && !room.getAmenities().isEmpty()) {
            roomDTO.setAmenities(
                    room.getAmenities()
                            .stream()
                            .map(amenity -> {
                                AmenityDTO dto = new AmenityDTO();
                                dto.setId(amenity.getId());
                                dto.setName(amenity.getName());
                                return dto;
                            })
                            .collect(Collectors.toList()));
        }
        return roomDTO;
    }

    public static HotelDTO mapHotelEntityToHotelDTO(Hotel hotel) {
        HotelDTO hotelDTO = new HotelDTO();

        // Ánh xạ danh sách ảnh khách sạn
        List<ImageDTO> images = hotel.getImages().stream()
                .map(image -> new ImageDTO(image.getId(), image.getImageUrl()))
                .collect(Collectors.toList());

        // Ánh xạ đánh giá
        List<ReviewsDTO> reviews = hotel.getReviews().stream()
                .map(review -> new ReviewsDTO(review.getId(), review.getRating(), review.getContent()))
                .collect(Collectors.toList());

        // Ánh xạ danh sách RoomType
        List<RoomTypeDTO> roomTypes = hotel.getRoomTypes().stream()
                .map(roomType -> {
                    // ánh xạ tiện nghi
                    List<AmenityDTO> amenities = roomType.getAmenities().stream()
                            .map(amenity -> new AmenityDTO(
                                    amenity.getId(),
                                    amenity.getName(),
                                    roomType.getId()))
                            .collect(Collectors.toList());

                    // ánh xạ bookings
                    List<BookingDTO> bookings = roomType.getBookings() != null
                            ? roomType.getBookings().stream()
                                    .map(Utils::mapBookingEntityToBookingDTO)
                                    .collect(Collectors.toList())
                            : null;

                    // ánh xạ url ảnh
                    List<String> imageFiles = roomType.getImages() != null
                            ? roomType.getImages().stream()
                                    .map(Image::getImageUrl)
                                    .collect(Collectors.toList())
                            : null;

                    return new RoomTypeDTO(
                            roomType.getId(),
                            hotel.getId(), // hotelId
                            roomType.getName(),
                            roomType.getQuantityBed(),
                            roomType.getQuantityPeople(),
                            roomType.getRoomArea(),
                            roomType.getQuantityRoom(),
                            roomType.getPrice(),
                            amenities,
                            bookings,
                            imageFiles);
                })
                .collect(Collectors.toList());

        // Thiết lập thông tin cho HotelDTO
        hotelDTO.setId(hotel.getId());
        hotelDTO.setName(hotel.getName());
        hotelDTO.setAddress(hotel.getAddress());
        hotelDTO.setLinkMap(hotel.getLinkMap());
        hotelDTO.setDescription(hotel.getDescription());
        hotelDTO.setRate(hotel.getRate());
        hotelDTO.setCheckInTime(hotel.getCheckInTime());
        hotelDTO.setCheckOutTime(hotel.getCheckOutTime());
        hotelDTO.setImages(images);
        hotelDTO.setRoomTypes(roomTypes);
        hotelDTO.setReviews(reviews);

        return hotelDTO;
    }

    public static List<UserDTO> mapUserListEntityToUserListDTO(List<User> userList) {
        return userList.stream().map(Utils::mapUserEntityToUserDTO).collect(Collectors.toList());
    }

    public static AmenityDTO mapAmenityEntityToAmenityDTO(Amenity amenity) {
        AmenityDTO dto = new AmenityDTO();
        dto.setId(amenity.getId());
        dto.setName(amenity.getName());
        dto.setRoomTypeId(amenity.getRoomType() != null ? amenity.getRoomType().getId() : null);
        return dto;
    }

    public static List<AmenityDTO> mapAmenityListEntityToDTOList(List<Amenity> amenities) {
        return amenities.stream()
                .map(Utils::mapAmenityEntityToAmenityDTO)
                .collect(Collectors.toList());
    }
}
