package com.example.hotelbookingserver.services.impl;

import com.example.hotelbookingserver.dtos.BookingDTO;
import com.example.hotelbookingserver.dtos.request.CreateBookingRequest;
import com.example.hotelbookingserver.dtos.request.UpdateBookingRequest;
import com.example.hotelbookingserver.dtos.response.Response;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface IBookingService {

    Response<BookingDTO> createBooking(CreateBookingRequest request);

    Response<BookingDTO> getBookingById(UUID bookingId);

    Response<List<BookingDTO>> getAllBookings();

    Response<List<BookingDTO>> getBookingsByUser(UUID userId, Pageable pageable);

    Response<List<BookingDTO>> getBookingsByHotel(UUID hotelId, Pageable pageable);

    Response<BookingDTO> cancelBooking(UUID bookingId, String reason);

    Response<BookingDTO> updateBooking(UUID bookingId, UpdateBookingRequest request);

    Response<BookingDTO> confirmPayment(UUID bookingId, String paymentMethod, String paymentStatus);
}
