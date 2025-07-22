package com.example.hotelbookingserver.services;

import java.util.UUID;

import com.example.hotelbookingserver.dtos.Response;
import com.example.hotelbookingserver.entities.Booking;

public interface IBookingService {
    Response saveBooking(UUID roomId, UUID userId, Booking bookingRequest);

    Response getAllBookings();

    Response cancelBooking(UUID bookingId);
}
