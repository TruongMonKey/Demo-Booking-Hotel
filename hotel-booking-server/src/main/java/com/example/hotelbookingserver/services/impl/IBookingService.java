package com.example.hotelbookingserver.services.impl;

import com.example.hotelbookingserver.dtos.requests.BookingCreateRequest;
import com.example.hotelbookingserver.dtos.requests.CreateBookingRequest;
import com.example.hotelbookingserver.dtos.requests.UpdateBookingRequest;
import com.example.hotelbookingserver.dtos.responses.Response;

import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface IBookingService {

    Response<BookingCreateRequest> createBooking(CreateBookingRequest request);

    Response<BookingCreateRequest> getBookingById(UUID bookingId);

    Response<List<BookingCreateRequest>> getAllBookings();

    Response<List<BookingCreateRequest>> getBookingsByUser(UUID userId, Pageable pageable);

    Response<List<BookingCreateRequest>> getBookingsByHotel(UUID hotelId, Pageable pageable);

    Response<BookingCreateRequest> cancelBooking(UUID bookingId, String reason);

    Response<BookingCreateRequest> updateBooking(UUID bookingId, UpdateBookingRequest request);

    Response<BookingCreateRequest> confirmPayment(UUID bookingId, String paymentMethod, String paymentStatus);
}
