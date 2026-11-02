package com.example.hotelbookingserver.utils;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.math.BigDecimal;

import com.example.hotelbookingserver.dtos.requests.BookingCreateRequest;
import com.example.hotelbookingserver.dtos.responses.AmenityDTO;
import com.example.hotelbookingserver.dtos.responses.BookingResponseDTO;
import com.example.hotelbookingserver.dtos.responses.HotelResponseDTO;
import com.example.hotelbookingserver.dtos.responses.ImageDTO;
import com.example.hotelbookingserver.dtos.responses.ReviewResponseDTO;
import com.example.hotelbookingserver.dtos.responses.RoomTypeResponseDTO;
import com.example.hotelbookingserver.dtos.responses.UserResponseDTO;
import com.example.hotelbookingserver.entities.Amenity;
import com.example.hotelbookingserver.entities.Booking;
import com.example.hotelbookingserver.entities.Hotel;
import com.example.hotelbookingserver.entities.RoomType;
import com.example.hotelbookingserver.entities.User;

public class Utils {

    public static UserResponseDTO mapUserEntityToUserDTO(User user) {

        UserResponseDTO userDTO = new UserResponseDTO();
        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhone(user.getPhone());
        userDTO.setAge(user.getAge());
        userDTO.setAddress(user.getAddress());
        userDTO.setGender(user.getGender() != null ? user.getGender().name() : null);
        // Note: roles mapping to RoleDTO list would require RoleDTO conversion
        // For now, just map role names
        return userDTO;
    }

    /**
     * Map Booking entity -> BookingDTO
     * Cho phép chọn có map nested User, Hotel, RoomType hay không
     *
     * @param booking      Booking entity cần map
     * @param includeUser  true nếu muốn map nested UserDTO
     * @param includeHotel true nếu muốn map nested HotelDTO
     * @param includeRoom  true nếu muốn map nested RoomTypeDTO
     * @return BookingDTO đã map
     */
    public static BookingCreateRequest mapBookingToDTO(Booking booking,
            boolean includeUser,
            boolean includeHotel,
            boolean includeRoom) {
        if (booking == null)
            return null;

        BookingCreateRequest dto = new BookingCreateRequest();
        dto.setId(booking.getId());
        dto.setCheckInDate(booking.getCheckInDate());
        dto.setCheckOutDate(booking.getCheckOutDate());
        dto.setNumberOfRooms(booking.getNumberOfRooms() != null ? booking.getNumberOfRooms() : 1);
        dto.setNumberOfGuests(booking.getNumberOfGuests() != null ? booking.getNumberOfGuests() : 1);
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus() != null ? booking.getStatus().name() : null);
        dto.setCancelReason(booking.getCancelReason());
        dto.setPaymentStatus(booking.getPaymentStatus());
        dto.setPaymentMethod(booking.getPaymentMethod());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());

        // Map nested UserDTO nếu includeUser = true
        if (includeUser && booking.getUser() != null) {
            UserResponseDTO userDTO = new UserResponseDTO();
            userDTO.setId(booking.getUser().getId());
            userDTO.setName(booking.getUser().getName());
            userDTO.setEmail(booking.getUser().getEmail());
            dto.setUser(userDTO);
            dto.setUserId(booking.getUser().getId());
        }

        // Map nested HotelDTO nếu includeHotel = true
        if (includeHotel && booking.getHotel() != null) {
            HotelResponseDTO hotelDTO = new HotelResponseDTO();
            hotelDTO.setId(booking.getHotel().getId());
            hotelDTO.setName(booking.getHotel().getName());
            hotelDTO.setLinkMap(booking.getHotel().getLinkMap());
            dto.setHotel(hotelDTO);
            dto.setHotelId(booking.getHotel().getId());
        }

        // Map nested RoomTypeDTO nếu includeRoom = true
        if (includeRoom && booking.getRoomType() != null) {
            RoomTypeResponseDTO roomDTO = new RoomTypeResponseDTO();
            roomDTO.setId(booking.getRoomType().getId());
            roomDTO.setName(booking.getRoomType().getName());
            roomDTO.setQuantityBed(booking.getRoomType().getQuantityBed());
            roomDTO.setQuantityPeople(booking.getRoomType().getQuantityPeople());
            roomDTO.setRoomArea(booking.getRoomType().getRoomArea());
            roomDTO.setPrice(booking.getRoomType().getPrice());
            dto.setRoomType(roomDTO);
            dto.setRoomTypeId(booking.getRoomType().getId());
        }

        return dto;
    }

    public static BookingCreateRequest mapBookingToDTO(Booking booking) {
        return mapBookingToDTO(booking, true, true, true);
    }

    public static RoomTypeResponseDTO mapRoomEntityToRoomDTO(RoomType roomType) {
        RoomTypeResponseDTO roomTypeDTO = new RoomTypeResponseDTO();

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

    public static BookingCreateRequest mapBookingEntityToBookingDTOPlusBookedRooms(Booking booking, boolean mapUser) {
        if (booking == null)
            return null;

        BookingCreateRequest bookingDTO = new BookingCreateRequest();
        bookingDTO.setId(booking.getId());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setNumberOfRooms(booking.getNumberOfRooms() != null ? booking.getNumberOfRooms() : 1);
        bookingDTO.setNumberOfGuests(booking.getNumberOfGuests() != null ? booking.getNumberOfGuests() : 1);
        bookingDTO.setTotalPrice(booking.getTotalPrice());
        bookingDTO.setStatus(booking.getStatus().name());
        bookingDTO.setCancelReason(booking.getCancelReason());

        // Map user
        if (mapUser && booking.getUser() != null) {
            bookingDTO.setUser(Utils.mapUserEntityToUserDTO(booking.getUser()));
        }

        // Map roomType
        if (booking.getRoomType() != null) {
            RoomType room = booking.getRoomType();
            RoomTypeResponseDTO roomDTO = new RoomTypeResponseDTO();
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
                HotelResponseDTO hotelDTO = new HotelResponseDTO();
                hotelDTO.setId(room.getHotel().getId());
                hotelDTO.setName(room.getHotel().getName());
                hotelDTO.setLinkMap(room.getHotel().getLinkMap());
                bookingDTO.setHotel(hotelDTO);
            }
        }

        return bookingDTO;
    }

    public static UserResponseDTO mapUserEntityToUserDTOPlusUserBookingsAndRoom(User user) {
        UserResponseDTO userDTO = new UserResponseDTO();

        userDTO.setId(user.getId());
        userDTO.setName(user.getName());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhone(user.getPhone());
        userDTO.setAge(user.getAge());
        userDTO.setAddress(user.getAddress());
        userDTO.setGender(user.getGender() != null ? user.getGender().name() : null);

        return userDTO;
    }

    public static List<RoomTypeResponseDTO> mapRoomListEntityToRoomListDTO(List<RoomType> roomList) {
        return roomList.stream().map(Utils::mapRoomEntityToRoomDTO).collect(Collectors.toList());
    }

    public static List<BookingCreateRequest> mapBookingListEntityToBookingListDTO(
            List<Booking> bookingList,
            boolean includeUser,
            boolean includeHotel,
            boolean includeRoom) {
        if (bookingList == null)
            return Collections.emptyList();

        return bookingList.stream()
                .map(b -> Utils.mapBookingToDTO(b, includeUser, includeHotel, includeRoom))
                .collect(Collectors.toList());
    }

    public static RoomTypeResponseDTO mapRoomEntityToRoomDTOPlusBookings(RoomType room) {
        RoomTypeResponseDTO roomDTO = new RoomTypeResponseDTO();

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

        // Map bookings as BookingResponseDTO (minimal, without nested objects to avoid
        // circular refs)
        if (room.getBookings() != null) {
            roomDTO.setBookings(
                    room.getBookings().stream()
                            .map(b -> {
                                BookingResponseDTO dto = new BookingResponseDTO();
                                dto.setId(b.getId());
                                dto.setCheckInDate(b.getCheckInDate());
                                dto.setCheckOutDate(b.getCheckOutDate());
                                dto.setNumberOfRooms(b.getNumberOfRooms());
                                dto.setNumberOfGuests(b.getNumberOfGuests());
                                dto.setTotalPrice(b.getTotalPrice());
                                dto.setStatus(b.getStatus() != null ? b.getStatus().name() : null);
                                dto.setPaymentStatus(b.getPaymentStatus());
                                dto.setPaymentMethod(b.getPaymentMethod());
                                dto.setCancelReason(b.getCancelReason());
                                dto.setCreatedAt(b.getCreatedAt());
                                dto.setUpdatedAt(b.getUpdatedAt());
                                return dto;
                            })
                            .collect(Collectors.toList()));
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

    public static HotelResponseDTO mapHotelEntityToHotelDTO(Hotel hotel) {
        HotelResponseDTO hotelDTO = new HotelResponseDTO();

        // images
        List<ImageDTO> images = hotel.getImages() != null
                ? hotel.getImages().stream()
                        .map(image -> new ImageDTO(image.getId(), image.getImageUrl()))
                        .collect(Collectors.toList())
                : Collections.emptyList();

        // reviews
        List<ReviewResponseDTO> reviews = hotel.getReviews() != null
                ? hotel.getReviews().stream()
                        .map(review -> new ReviewResponseDTO(review.getId(), review.getRating(), review.getContent()))
                        .collect(Collectors.toList())
                : Collections.emptyList();

        // roomTypes
        List<RoomTypeResponseDTO> roomTypes = hotel.getRoomTypes() != null
                ? hotel.getRoomTypes().stream()
                        .map(roomType -> {
                            RoomTypeResponseDTO rtDTO = new RoomTypeResponseDTO();
                            rtDTO.setId(roomType.getId());
                            rtDTO.setHotelId(hotel.getId());
                            rtDTO.setName(roomType.getName());
                            rtDTO.setQuantityBed(roomType.getQuantityBed());
                            rtDTO.setQuantityPeople(roomType.getQuantityPeople());
                            rtDTO.setRoomArea(roomType.getRoomArea());
                            rtDTO.setQuantityRoom(roomType.getQuantityRoom());
                            rtDTO.setPrice(roomType.getPrice());

                            if (roomType.getAmenities() != null) {
                                rtDTO.setAmenities(
                                        roomType.getAmenities().stream()
                                                .map(amenity -> {
                                                    AmenityDTO dto = new AmenityDTO();
                                                    dto.setId(amenity.getId());
                                                    dto.setName(amenity.getName());
                                                    return dto;
                                                })
                                                .collect(Collectors.toList()));
                            }

                            if (roomType.getImages() != null) {
                                rtDTO.setImageFiles(
                                        roomType.getImages().stream()
                                                .map(img -> img.getImageUrl())
                                                .collect(Collectors.toList()));
                            }

                            return rtDTO;
                        })
                        .collect(Collectors.toList())
                : Collections.emptyList();

        hotelDTO.setId(hotel.getId());
        hotelDTO.setName(hotel.getName());
        hotelDTO.setAddress(hotel.getAddress());
        hotelDTO.setLinkMap(hotel.getLinkMap());
        hotelDTO.setDescription(hotel.getDescription());
        hotelDTO.setRate(hotel.getRate() != null ? BigDecimal.valueOf(hotel.getRate()) : null);
        hotelDTO.setCheckInTime(hotel.getCheckInTime());
        hotelDTO.setCheckOutTime(hotel.getCheckOutTime());
        hotelDTO.setImages(images);
        hotelDTO.setRoomTypes(roomTypes);
        hotelDTO.setReviews(reviews);

        return hotelDTO;
    }

    public static List<UserResponseDTO> mapUserListEntityToUserListDTO(List<User> userList) {
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
