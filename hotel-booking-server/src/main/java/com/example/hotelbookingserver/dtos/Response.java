package com.example.hotelbookingserver.dtos;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response {

    private int statusCode;
    private String message;

    private String fullName;
    private String email;
    private String phone;
    private String token;
    private String role;
    private String expirationTime;

    private UserDTO user;
    private RoomTypeDTO room;
    private BookingDTO booking;
    private List<HotelDTO> hotelList;
    private List<UserDTO> userList;
    private List<RoomTypeDTO> roomList;
    private List<BookingDTO> bookingList;
    private List<AmenityDTO> amenityList;
}
