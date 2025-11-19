package com.example.hotelbookingserver.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.hotelbookingserver.dtos.BookingDTO;
import com.example.hotelbookingserver.dtos.response.Response;
import com.example.hotelbookingserver.entities.Booking;
import com.example.hotelbookingserver.entities.RoomType;
import com.example.hotelbookingserver.entities.User;
import com.example.hotelbookingserver.entities.constants.EBookingStatus;
import com.example.hotelbookingserver.exception.OurException;
import com.example.hotelbookingserver.repositories.BookingRepository;
import com.example.hotelbookingserver.repositories.RoomTypeRepository;
import com.example.hotelbookingserver.repositories.UserRepository;
import com.example.hotelbookingserver.services.impl.IBookingService;
import com.example.hotelbookingserver.utils.Utils;

import jakarta.transaction.Transactional;

@Service
public class BookingService implements IBookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomTypeRepository roomRepository;

    @Override
    @Transactional
    public Response<BookingDTO> createBooking(UUID userId, UUID roomTypeId, LocalDate checkIn, LocalDate checkOut,
            int quantity) {
        Response<BookingDTO> response = new Response<>();
        try {
            if (!checkOut.isAfter(checkIn)) {
                throw new OurException("Check-out must be after check-in");
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new OurException("User not found"));

            RoomType room = roomRepository.findById(roomTypeId)
                    .orElseThrow(() -> new OurException("RoomType not found"));

            // Kiểm tra phòng trống
            int booked = bookingRepository.findActiveBookingsByRoomTypeAndDateRange(roomTypeId, checkIn, checkOut)
                    .stream()
                    .mapToInt(b -> b.getNumberOfRooms() != null ? b.getNumberOfRooms() : 1)
                    .sum();

            int available = room.getQuantityBed() - booked;
            if (available < quantity) {
                throw new OurException("Not enough rooms available. Available: " + available);
            }

            // Tạo booking
            Booking booking = new Booking();
            booking.setUser(user);
            booking.setRoomType(room);
            booking.setHotel(room.getHotel());
            booking.setCheckInDate(checkIn);
            booking.setCheckOutDate(checkOut);
            booking.setNumberOfRooms(quantity);
            booking.setNumberOfGuests(quantity);
            long days = ChronoUnit.DAYS.between(checkIn, checkOut);
            BigDecimal totalPrice = room.getPrice().multiply(BigDecimal.valueOf(quantity))
                    .multiply(BigDecimal.valueOf(days));
            booking.setTotalPrice(totalPrice);
            booking.setStatus(EBookingStatus.PENDING);

            Booking saved = bookingRepository.save(booking);

            // Map entity -> DTO
            BookingDTO dto = Utils.mapBookingToDTO(saved);

            response.setStatusCode(200);
            response.setMessage("Booking created successfully");
            response.setData(dto);

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error creating booking: " + e.getMessage());
        }

        return response;
    }

    @Override
    @Transactional
    public Response<BookingDTO> cancelBooking(UUID bookingId, String reason) {
        Response<BookingDTO> response = new Response<>();
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new OurException("Booking not found"));

            if (booking.getStatus() == EBookingStatus.CANCELLED
                    || booking.getStatus() == EBookingStatus.AUTO_CANCELLED) {
                throw new OurException("Booking already cancelled");
            }

            booking.setStatus(EBookingStatus.CANCELLED);
            booking.setCancelReason(reason);

            Booking saved = bookingRepository.save(booking);

            BookingDTO dto = Utils.mapBookingToDTO(saved);
            response.setStatusCode(200);
            response.setMessage("Booking cancelled successfully");
            response.setData(dto);

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error cancelling booking: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response<List<BookingDTO>> getAllBookings() {
        Response<List<BookingDTO>> response = new Response<>();
        try {
            List<BookingDTO> bookings = bookingRepository.findAll()
                    .stream()
                    .map(Utils::mapBookingToDTO)
                    .collect(Collectors.toList());

            response.setStatusCode(200);
            response.setMessage("Success");
            response.setData(bookings);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching bookings: " + e.getMessage());
        }
        return response;
    }

    @Override
    public void autoCancelExpiredBookings() {
        LocalDate today = LocalDate.now();
        List<Booking> pending = bookingRepository.findByStatus(EBookingStatus.PENDING);
        for (Booking b : pending) {
            if (b.getCheckInDate().isBefore(today)) {
                b.setStatus(EBookingStatus.AUTO_CANCELLED);
                bookingRepository.save(b);
            }
        }
    }
}
