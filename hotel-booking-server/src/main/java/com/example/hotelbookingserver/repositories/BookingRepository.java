package com.example.hotelbookingserver.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.hotelbookingserver.entities.Booking;
import com.example.hotelbookingserver.entities.constants.EBookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
     // Lấy booking ACTIVE theo RoomType & date range (check trùng phòng)
     @Query("SELECT b FROM Booking b WHERE b.roomType.id = :roomId AND b.status = 'ACTIVE' "
               + "AND b.checkInDate < :checkOut AND b.checkOutDate > :checkIn")
     List<Booking> findActiveBookingsByRoomTypeAndDateRange(
               @Param("roomId") UUID roomId,
               @Param("checkIn") LocalDate checkIn,
               @Param("checkOut") LocalDate checkOut);

     // Lấy booking kèm user, hotel, roomType để tránh N+1
     @Query("SELECT b FROM Booking b "
               + "JOIN FETCH b.user u "
               + "JOIN FETCH b.hotel h "
               + "JOIN FETCH b.roomType r "
               + "WHERE b.id = :id")
     Booking findBookingWithDetails(@Param("id") UUID id);

     List<Booking> findByStatus(EBookingStatus status);
}
