package com.example.hotelbookingserver.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import com.example.hotelbookingserver.dtos.BookingDTO;
import com.example.hotelbookingserver.dtos.response.Response;
import com.example.hotelbookingserver.services.impl.IBookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private IBookingService bookingService;

    @PostMapping
    public Response<BookingDTO> createBooking(
            @RequestParam UUID userId,
            @RequestParam UUID roomTypeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam int quantity) {
        return bookingService.createBooking(userId, roomTypeId, checkIn, checkOut, quantity);
    }

    @PatchMapping("/{bookingId}/cancel")
    public Response<BookingDTO> cancelBooking(
            @PathVariable UUID bookingId,
            @RequestParam(required = false, defaultValue = "Cancelled by user") String reason) {
        return bookingService.cancelBooking(bookingId, reason);
    }

    @GetMapping
    public Response<List<BookingDTO>> getAllBookings() {
        return bookingService.getAllBookings();
    }
}
