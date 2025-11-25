package com.example.hotelbookingserver.dtos.request;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

import lombok.Data;

@Data
public class BookingShortDTO {
    private UUID id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BigDecimal totalPrice;
    private String status;
    private String paymentStatus;

    private HotelBriefDTO hotel;
    private RoomTypeBriefDTO roomType;
}
