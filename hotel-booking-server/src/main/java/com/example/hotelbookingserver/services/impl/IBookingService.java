package com.example.hotelbookingserver.services.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.example.hotelbookingserver.dtos.BookingDTO;
import com.example.hotelbookingserver.dtos.response.Response;

public interface IBookingService {

    Response<BookingDTO> createBooking(UUID userId, UUID roomTypeId, LocalDate checkIn, LocalDate checkOut,
            int quantity);

    Response<BookingDTO> cancelBooking(UUID bookingId, String reason);

    Response<List<BookingDTO>> getAllBookings();

    void autoCancelExpiredBookings();
}
