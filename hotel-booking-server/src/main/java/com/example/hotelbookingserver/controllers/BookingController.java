package com.example.hotelbookingserver.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.hotelbookingserver.dtos.BookingDTO;
import com.example.hotelbookingserver.dtos.request.CreateBookingRequest;
import com.example.hotelbookingserver.dtos.request.UpdateBookingRequest;
import com.example.hotelbookingserver.dtos.response.Response;
import com.example.hotelbookingserver.services.impl.IBookingService;

import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private IBookingService bookingService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Response<BookingDTO>> createBooking(@Valid @RequestBody CreateBookingRequest request) {
        Response<BookingDTO> r = bookingService.createBooking(request);
        return ResponseEntity.status(r.getStatusCode()).body(r);
    }

    @PatchMapping(value = "/{bookingId}/cancel", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Response<BookingDTO>> cancelBooking(
            @PathVariable UUID bookingId,
            @RequestParam(required = false, defaultValue = "Cancelled by user") String reason) {
        Response<BookingDTO> r = bookingService.cancelBooking(bookingId, reason);
        return ResponseEntity.status(r.getStatusCode()).body(r);
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Response<List<BookingDTO>>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        Response<List<BookingDTO>> r = bookingService.getAllBookings();
        return ResponseEntity.status(r.getStatusCode()).body(r);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Response<BookingDTO>> getBookingById(@PathVariable UUID id) {
        Response<BookingDTO> r = bookingService.getBookingById(id);
        return ResponseEntity.status(r.getStatusCode()).body(r);
    }

    @GetMapping(value = "/user/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Response<List<BookingDTO>>> getBookingsByUser(
            @PathVariable UUID userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        var r = bookingService.getBookingsByUser(userId, PageRequest.of(page, size));
        return ResponseEntity.status(r.getStatusCode()).body(r);
    }

    @GetMapping(value = "/hotel/{hotelId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Response<List<BookingDTO>>> getBookingsByHotel(
            @PathVariable UUID hotelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        var r = bookingService.getBookingsByHotel(hotelId, PageRequest.of(page, size));
        return ResponseEntity.status(r.getStatusCode()).body(r);
    }

    @PutMapping(value = "/{bookingId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Response<BookingDTO>> updateBooking(
            @PathVariable UUID bookingId,
            @Valid @RequestBody UpdateBookingRequest request) {
        Response<BookingDTO> r = bookingService.updateBooking(bookingId, request);
        return ResponseEntity.status(r.getStatusCode()).body(r);
    }

    @PostMapping(value = "/{bookingId}/payment", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Response<BookingDTO>> confirmPayment(
            @PathVariable UUID bookingId,
            @RequestParam String method,
            @RequestParam String status) {

        Response<BookingDTO> r = bookingService.confirmPayment(bookingId, method, status);
        return ResponseEntity.status(r.getStatusCode()).body(r);
    }
}