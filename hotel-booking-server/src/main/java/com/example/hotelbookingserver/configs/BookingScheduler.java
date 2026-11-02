package com.example.hotelbookingserver.configs;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.hotelbookingserver.entities.Booking;
import com.example.hotelbookingserver.entities.constants.EBookingStatus;
import com.example.hotelbookingserver.repositories.BookingRepository;

@Component
public class BookingScheduler {

    @Autowired
    private BookingRepository bookingRepository;

    // Chạy mỗi ngày lúc 00:00
    @Scheduled(cron = "0 0 0 * * ?")
    public void autoCancelPendingBookings() {
        LocalDate today = LocalDate.now();
        List<Booking> pendingBookings = bookingRepository.findByStatus(EBookingStatus.PENDING);

        for (Booking b : pendingBookings) {
            if (b.getCheckInDate().isBefore(today)) {
                b.setStatus(EBookingStatus.AUTO_CANCELLED);
                bookingRepository.save(b);
            }
        }
    }
}
