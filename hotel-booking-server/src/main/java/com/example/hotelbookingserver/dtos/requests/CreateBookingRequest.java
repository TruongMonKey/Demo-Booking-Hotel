package com.example.hotelbookingserver.dtos.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
public class CreateBookingRequest {
    @NotNull
    private UUID userId;
    @NotNull
    private UUID roomTypeId;
    @NotNull
    private LocalDate checkInDate;
    @NotNull
    private LocalDate checkOutDate;
    @Min(1)
    private int quantity;
}