package com.example.hotelbookingserver.utils;

import java.util.List;
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

    public static UserDTO mapUserEntityToUserDTO(User user) {

        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhone());
        userDTO.setRoles(
                user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList()));
        return userDTO;
    }

    public static BookingDTO mapBookingToDTO(Booking booking) {
        if (booking == null)
            return null;

        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId().toString());
        dto.setCheckInDate(booking.getCheckInDate());
        dto.setCheckOutDate(booking.getCheckOutDate());
        dto.setNumberOfRooms(booking.getNumberOfRooms() != null ? booking.getNumberOfRooms() : 1);
        dto.setNumberOfGuests(booking.getNumberOfGuests() != null ? booking.getNumberOfGuests() : 1);
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        dto.setCancelReason(booking.getCancelReason());

        // Map nested DTOs
        if (booking.getUser() != null) {
            UserDTO userDTO = new UserDTO();
            userDTO.setId(booking.getUser().getId());
            userDTO.setName(booking.getUser().getName());
            userDTO.setEmail(booking.getUser().getEmail());
            dto.setUser(userDTO);
        }

        if (booking.getHotel() != null) {
            HotelDTO hotelDTO = new HotelDTO();
            hotelDTO.setId(booking.getHotel().getId());
            hotelDTO.setName(booking.getHotel().getName());
            hotelDTO.setLinkMap(booking.getHotel().getLinkMap());
            dto.setHotel(hotelDTO);
        }

        if (booking.getRoomType() != null) {
            RoomTypeDTO roomDTO = new RoomTypeDTO();
            roomDTO.setId(booking.getRoomType().getId());
            roomDTO.setName(booking.getRoomType().getName());
            roomDTO.setQuantityBed(booking.getRoomType().getQuantityBed());
            roomDTO.setQuantityPeople(booking.getRoomType().getQuantityPeople());
            roomDTO.setRoomArea(booking.getRoomType().getRoomArea());
            roomDTO.setPrice(booking.getRoomType().getPrice());
            dto.setRoomType(roomDTO);
        }

        return dto;
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
        if (booking == null)
            return null;

        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setId(booking.getId().toString());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setNumberOfRooms(booking.getNumberOfRooms() != null ? booking.getNumberOfRooms() : 1);
        bookingDTO.setNumberOfGuests(booking.getNumberOfGuests() != null ? booking.getNumberOfGuests() : 1);
        bookingDTO.setTotalPrice(booking.getTotalPrice());
        bookingDTO.setStatus(booking.getStatus());
        bookingDTO.setCancelReason(booking.getCancelReason());

        // Map user
        if (mapUser && booking.getUser() != null) {
            bookingDTO.setUser(Utils.mapUserEntityToUserDTO(booking.getUser()));
        }

        // Map roomType
        if (booking.getRoomType() != null) {
            RoomType room = booking.getRoomType();
            RoomTypeDTO roomDTO = new RoomTypeDTO();
            roomDTO.setId(room.getId());
            roomDTO.setName(room.getName());
            roomDTO.setQuantityBed(room.getQuantityBed());
            roomDTO.setQuantityPeople(room.getQuantityPeople());
            roomDTO.setRoomArea(room.getRoomArea());
            roomDTO.setQuantityRoom(room.getQuantityRoom());
            roomDTO.setPrice(room.getPrice());

            // Map amenities
            if (room.getAmenities() != null && !room.getAmenities().isEmpty()) {
                roomDTO.setAmenities(
                        room.getAmenities().stream()
                                .map(a -> {
                                    AmenityDTO dto = new AmenityDTO();
                                    dto.setId(a.getId());
                                    dto.setName(a.getName());
                                    return dto;
                                })
                                .collect(Collectors.toList()));
            }

            bookingDTO.setRoomType(roomDTO);

            // Map hotel
            if (room.getHotel() != null) {
                HotelDTO hotelDTO = new HotelDTO();
                hotelDTO.setId(room.getHotel().getId());
                hotelDTO.setName(room.getHotel().getName());
                hotelDTO.setLinkMap(room.getHotel().getLinkMap());
                bookingDTO.setHotel(hotelDTO);
            }
        }

        return bookingDTO;
    }

    public static UserDTO mapUserEntityToUserDTOPlusUserBookingsAndRoom(User user) {
        UserDTO userDTO = new UserDTO();

        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhone());
        userDTO.setRoles(
                user.getRoles().stream()
                        .map(role -> role.getName().name())
                        .collect(Collectors.toList()));

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
        return bookingList.stream().map(Utils::mapBookingToDTO).collect(Collectors.toList());
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
                    room.getBookings().stream().map(Utils::mapBookingToDTO).collect(Collectors.toList()));
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

        List<ImageDTO> images = hotel.getImages().stream()
                .map(image -> new ImageDTO(image.getId(), image.getImageUrl()))
                .collect(Collectors.toList());

        List<ReviewsDTO> reviews = hotel.getReviews().stream()
                .map(review -> new ReviewsDTO(review.getId(), review.getRating(), review.getContent()))
                .collect(Collectors.toList());

        List<RoomTypeDTO> roomTypes = hotel.getRoomTypes().stream()
                .map(roomType -> {
                    List<AmenityDTO> amenities = roomType.getAmenities().stream()
                            .map(amenity -> new AmenityDTO(
                                    amenity.getId(),
                                    amenity.getName(),
                                    roomType.getId()))
                            .collect(Collectors.toList());

                    List<BookingDTO> bookings = roomType.getBookings() != null
                            ? roomType.getBookings().stream()
                                    .map(Utils::mapBookingToDTO)
                                    .collect(Collectors.toList())
                            : null;

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

    public static AmenityDTO mapAmenityEntityToDTO(Amenity amenity) {
        return new AmenityDTO(
                amenity.getId(),
                amenity.getName(),
                amenity.getRoomType().getId());
    }

    public static List<AmenityDTO> mapAmenityListEntityToDTOList(List<Amenity> amenities) {
        return amenities.stream()
                .map(Utils::mapAmenityEntityToDTO)
                .collect(Collectors.toList());
    }
}
