package com.example.hotelbookingserver.dtos;

import java.time.LocalDate;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookingDTO {
    private UUID id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private UUID hotelId;
    private UUID userId;
    private UUID roomTypeId;
    private String status;

    private HotelDTO hotel;
    private UserDTO user;
    private RoomTypeDTO room;
}
