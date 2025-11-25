package com.example.hotelbookingserver.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.hotelbookingserver.dtos.BookingDTO;
import com.example.hotelbookingserver.dtos.request.CreateBookingRequest;
import com.example.hotelbookingserver.dtos.request.UpdateBookingRequest;
import com.example.hotelbookingserver.dtos.response.Response;
import com.example.hotelbookingserver.entities.Booking;
import com.example.hotelbookingserver.entities.Hotel;
import com.example.hotelbookingserver.entities.RoomType;
import com.example.hotelbookingserver.entities.User;
import com.example.hotelbookingserver.entities.constants.EBookingStatus;
import com.example.hotelbookingserver.exception.ResourceNotFoundException;
import com.example.hotelbookingserver.repositories.BookingRepository;
import com.example.hotelbookingserver.repositories.HotelRepository;
import com.example.hotelbookingserver.repositories.RoomTypeRepository;
import com.example.hotelbookingserver.repositories.UserRepository;
import com.example.hotelbookingserver.services.impl.IBookingService;
import com.example.hotelbookingserver.utils.Utils;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService implements IBookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private UserRepository userRepository;

    private long nightsBetween(LocalDate checkIn, LocalDate checkOut) {
        return Duration.between(checkIn.atStartOfDay(), checkOut.atStartOfDay()).toDays();
    }

    @Override
    @Transactional
    public Response<BookingDTO> createBooking(CreateBookingRequest request) {
        Response<BookingDTO> resp = new Response<>();
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getUserId()));
        RoomType roomType = roomTypeRepository.findById(request.getRoomTypeId())
                .orElseThrow(() -> new ResourceNotFoundException("RoomType not found: " + request.getRoomTypeId()));

        Hotel hotel = roomType.getHotel();
        if (hotel == null) {
            throw new ResourceNotFoundException("Hotel not found for roomType: " + roomType.getId());
        }

        LocalDate start = request.getCheckInDate();
        LocalDate end = request.getCheckOutDate();
        if (start == null || end == null || !end.isAfter(start)) {
            resp.setStatusCode(400);
            resp.setMessage("Invalid dates: check-out must be after check-in");
            return resp;
        }
        Integer booked;
        try {
            booked = bookingRepository.sumRoomsBookedBetween(roomType.getId(), start, end);
        } catch (Exception ex) {
            booked = bookingRepository.findActiveBookingsByRoomTypeAndDateRange(
                    roomType.getId(), start, end).stream()
                    .map(b -> b.getNumberOfRooms() != null ? b.getNumberOfRooms() : 0)
                    .reduce(0, Integer::sum);
        }
        int alreadyBooked = booked == null ? 0 : booked;
        int available = roomType.getQuantityRoom() - alreadyBooked;
        if (available < request.getQuantity()) {
            resp.setStatusCode(409);
            resp.setMessage("Not enough rooms available. Available: " + available);
            return resp;
        }

        long nights = nightsBetween(start, end);
        BigDecimal pricePerNight = roomType.getPrice() != null ? roomType.getPrice() : BigDecimal.ZERO;
        BigDecimal total = pricePerNight.multiply(BigDecimal.valueOf(nights))
                .multiply(BigDecimal.valueOf(request.getQuantity()));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoomType(roomType);
        booking.setHotel(hotel);
        booking.setCheckInDate(start);
        booking.setCheckOutDate(end);
        booking.setNumberOfRooms(request.getQuantity());
        booking.setNumberOfGuests(request.getQuantity() * (roomType.getQuantityPeople()));
        booking.setTotalPrice(total);
        booking.setStatus(EBookingStatus.PENDING);
        booking.setPaymentStatus("UNPAID");
        booking.setPaymentMethod(null);
        booking.setCancelReason(null);
        // if BaseEntity handles createdAt/updatedAt, no need to set; otherwise:
        // booking.setCreatedAt(Instant.now()); booking.setUpdatedAt(Instant.now());

        Booking saved = bookingRepository.save(booking);

        resp.setStatusCode(201);
        resp.setMessage("Booking created successfully");
        resp.setData(Utils.mapBookingToDTO(saved, true, true, true));
        return resp;
    }

    @Override
    public Response<BookingDTO> getBookingById(UUID bookingId) {
        Response<BookingDTO> resp = new Response<>();
        Booking b = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));
        resp.setStatusCode(200);
        resp.setMessage("Get booking successfully");
        resp.setData(Utils.mapBookingToDTO(b, true, true, true));
        return resp;
    }

    @Override
    public Response<List<BookingDTO>> getAllBookings() {
        Response<List<BookingDTO>> resp = new Response<>();
        List<Booking> all = bookingRepository.findAll();
        resp.setStatusCode(200);
        resp.setMessage("Get all bookings successfully");
        resp.setData(Utils.mapBookingListEntityToBookingListDTO(all, true, true, true));
        return resp;
    }

    @Override
    public Response<List<BookingDTO>> getBookingsByUser(UUID userId,
            org.springframework.data.domain.Pageable pageable) {
        Response<List<BookingDTO>> resp = new Response<>();
        var page = bookingRepository.findByUserId(userId, pageable);
        resp.setStatusCode(200);
        resp.setMessage("Get bookings by user successfully");
        resp.setData(page.stream().map(b -> Utils.mapBookingToDTO(b, false, true, true)).collect(Collectors.toList()));
        return resp;
    }

    @Override
    public Response<List<BookingDTO>> getBookingsByHotel(UUID hotelId,
            org.springframework.data.domain.Pageable pageable) {
        Response<List<BookingDTO>> resp = new Response<>();
        var page = bookingRepository.findByHotelId(hotelId, pageable);
        resp.setStatusCode(200);
        resp.setMessage("Get bookings by hotel successfully");
        resp.setData(page.stream().map(b -> Utils.mapBookingToDTO(b, true, true, false)).collect(Collectors.toList()));
        return resp;
    }

    @Override
    @Transactional
    public Response<BookingDTO> cancelBooking(UUID bookingId, String reason) {
        Response<BookingDTO> resp = new Response<>();

        Booking b = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        // Nếu booking đã hủy
        if (b.getStatus() == EBookingStatus.CANCELLED) {
            resp.setStatusCode(400);
            resp.setMessage("Booking already cancelled");
            resp.setData(Utils.mapBookingToDTO(b, true, true, true));
            return resp;
        }

        // Nếu check-in đã bắt đầu
        if (!LocalDate.now().isBefore(b.getCheckInDate())) {
            resp.setStatusCode(400);
            resp.setMessage("Cannot cancel booking on or after check-in date");
            resp.setData(Utils.mapBookingToDTO(b, true, true, true));
            return resp;
        }

        // Hủy booking hợp lệ
        b.setStatus(EBookingStatus.CANCELLED);
        b.setCancelReason(reason);
        b.setPaymentStatus("REFUND_PENDING"); // placeholder
        b.setUpdatedAt(Instant.now());

        Booking saved = bookingRepository.save(b);

        resp.setStatusCode(200);
        resp.setMessage("Booking cancelled successfully");
        resp.setData(Utils.mapBookingToDTO(saved, true, true, true));
        return resp;
    }

    @Override
    @Transactional
    public Response<BookingDTO> updateBooking(UUID bookingId, UpdateBookingRequest request) {
        Response<BookingDTO> resp = new Response<>();
        Booking b = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));

        LocalDate newCheckIn = request.getCheckInDate() != null ? request.getCheckInDate() : b.getCheckInDate();
        LocalDate newCheckOut = request.getCheckOutDate() != null ? request.getCheckOutDate() : b.getCheckOutDate();
        Integer newNumberRooms = request.getNumberOfRooms() != null ? request.getNumberOfRooms() : b.getNumberOfRooms();

        if (!newCheckOut.isAfter(newCheckIn)) {
            resp.setStatusCode(400);
            resp.setMessage("Check-out must be after check-in");
            return resp;
        }

        // check availability excluding this booking itself
        Integer booked;
        try {
            booked = bookingRepository.sumRoomsBookedBetween(b.getRoomType().getId(), newCheckIn, newCheckOut);
        } catch (Exception ex) {
            booked = bookingRepository.findActiveBookingsByRoomTypeAndDateRange(
                    b.getRoomType().getId(), newCheckIn, newCheckOut).stream()
                    .map(x -> x.getNumberOfRooms() != null ? x.getNumberOfRooms() : 0)
                    .reduce(0, Integer::sum);
        }

        int bookedExcludingSelf = (booked == null ? 0 : booked)
                - (b.getNumberOfRooms() != null ? b.getNumberOfRooms() : 0);

        int available = b.getRoomType().getQuantityRoom() - bookedExcludingSelf;

        if (available < newNumberRooms) {
            resp.setStatusCode(409);
            resp.setMessage("Not enough rooms available for the new dates. Available: " + available);
            return resp;
        }

        long nights = nightsBetween(newCheckIn, newCheckOut);
        BigDecimal newTotal = b.getRoomType().getPrice()
                .multiply(BigDecimal.valueOf(nights))
                .multiply(BigDecimal.valueOf(newNumberRooms));

        b.setCheckInDate(newCheckIn);
        b.setCheckOutDate(newCheckOut);
        b.setNumberOfRooms(newNumberRooms);
        b.setTotalPrice(newTotal);
        b.setUpdatedAt(Instant.now());
        Booking saved = bookingRepository.save(b);

        resp.setStatusCode(200);
        resp.setMessage("Booking updated successfully");
        resp.setData(Utils.mapBookingToDTO(saved, true, true, true));
        return resp;
    }

    @Override
    @Transactional
    public Response<BookingDTO> confirmPayment(UUID bookingId, String paymentMethod, String paymentStatus) {
        Response<BookingDTO> resp = new Response<>();
        Booking b = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found: " + bookingId));
        b.setPaymentMethod(paymentMethod);
        b.setPaymentStatus(paymentStatus);
        if ("PAID".equalsIgnoreCase(paymentStatus)) {
            b.setStatus(EBookingStatus.COMPLETED);
        }
        b.setUpdatedAt(Instant.now());
        Booking saved = bookingRepository.save(b);
        resp.setStatusCode(200);
        resp.setMessage("Payment status updated");
        resp.setData(Utils.mapBookingToDTO(saved, true, true, true));
        return resp;
    }
}