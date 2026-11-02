package com.example.hotelbookingserver.dtos.responses;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingResponseDTO {
    private UUID id;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numberOfRooms;
    private Integer numberOfGuests;
    private BigDecimal totalPrice;
    private String status;
    private String paymentStatus;
    private String paymentMethod;
    private String cancelReason;
    private Instant createdAt;
    private Instant updatedAt;
    private UserResponseDTO user;
    private HotelResponseDTO hotel;
    private RoomTypeResponseDTO roomType;
}
