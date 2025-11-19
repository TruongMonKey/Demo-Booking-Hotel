package com.example.hotelbookingserver.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import com.example.hotelbookingserver.entities.constants.EBookingStatus;

@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
public class BookingDTO {
    private String id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int numberOfRooms;
    private int numberOfGuests;
    private BigDecimal totalPrice;
    private EBookingStatus status;
    private String cancelReason;

    private UserDTO user;
    private HotelDTO hotel;
    private RoomTypeDTO roomType;
}
