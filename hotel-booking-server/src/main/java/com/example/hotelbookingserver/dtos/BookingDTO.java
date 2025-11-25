package com.example.hotelbookingserver.dtos;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookingDTO {
    private UUID id;
    private UUID userId;
    private UUID hotelId;
    private UUID roomTypeId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer numberOfRooms;
    private Integer numberOfGuests;
    private BigDecimal totalPrice;
    private String status; // e.g. PENDING, CONFIRMED, CANCELLED
    private String paymentStatus;
    private String paymentMethod;
    private String cancelReason;
    private Instant createdAt;
    private Instant updatedAt;
    private UserDTO user;
    private HotelDTO hotel;
    private RoomTypeDTO roomType;
}
