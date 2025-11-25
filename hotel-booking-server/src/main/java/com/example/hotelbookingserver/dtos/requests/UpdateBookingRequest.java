package com.example.hotelbookingserver.dtos.request;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class UpdateBookingRequest {

    private LocalDate checkInDate;

    private LocalDate checkOutDate;
    @Min(1)

    private Integer numberOfRooms;

    private Integer numberOfGuests;
}
