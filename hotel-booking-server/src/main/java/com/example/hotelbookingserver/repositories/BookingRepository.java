package com.example.hotelbookingserver.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.hotelbookingserver.entities.Booking;
import com.example.hotelbookingserver.entities.constants.EBookingStatus;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

     /**
      * Trả về các booking có overlap với [startDate, endDate) và có trạng thái =
      * status.
      * (Service có thể truyền EBookingStatus.CONFIRMED hoặc khác tuỳ rule).
      */
     @Query("SELECT b FROM Booking b " +
               "WHERE b.roomType.id = :roomId " +
               "AND b.status = :status " +
               "AND b.checkInDate < :endDate " +
               "AND b.checkOutDate > :startDate")
     List<Booking> findBookingsByRoomTypeAndDateRangeAndStatus(
               @Param("roomId") UUID roomId,
               @Param("startDate") LocalDate startDate,
               @Param("endDate") LocalDate endDate,
               @Param("status") EBookingStatus status);

     /**
      * Phiên bản trả Page (nếu cần phân trang).
      */
     @Query("SELECT b FROM Booking b " +
               "WHERE b.roomType.id = :roomId " +
               "AND b.status = :status " +
               "AND b.checkInDate < :endDate " +
               "AND b.checkOutDate > :startDate")
     Page<Booking> findBookingsByRoomTypeAndDateRangeAndStatus(
               @Param("roomId") UUID roomId,
               @Param("startDate") LocalDate startDate,
               @Param("endDate") LocalDate endDate,
               @Param("status") EBookingStatus status,
               Pageable pageable);

     /**
      * Tên cũ service dùng: findActiveBookingsByRoomTypeAndDateRange(...)
      * Mình thêm alias method để service fallback không lỗi (khi service calls
      * fallback).
      * status được set inside method implementation when calling via repo (caller
      * can pass EBookingStatus.CONFIRMED).
      */
     @Query("SELECT b FROM Booking b " +
               "WHERE b.roomType.id = :roomId " +
               "AND b.status <> com.example.hotelbookingserver.entities.constants.EBookingStatus.CANCELLED " +
               "AND b.checkInDate < :endDate " +
               "AND b.checkOutDate > :startDate")
     List<Booking> findActiveBookingsByRoomTypeAndDateRange(
               @Param("roomId") UUID roomId,
               @Param("startDate") LocalDate startDate,
               @Param("endDate") LocalDate endDate);

     /**
      * Lấy booking kèm user/hotel/roomType để tránh N+1.
      */
     @Query("SELECT DISTINCT b FROM Booking b " +
               "JOIN FETCH b.user u " +
               "JOIN FETCH b.hotel h " +
               "JOIN FETCH b.roomType r " +
               "WHERE b.id = :id")
     Optional<Booking> findBookingWithDetails(@Param("id") UUID id);

     /**
      * Tìm theo status
      */
     List<Booking> findByStatus(EBookingStatus status);

     /**
      * Hỗ trợ phân trang: findByUserId / findByHotelId trả Page để service dễ lấy
      * nội dung.
      */
     Page<Booking> findByUserId(UUID userId, Pageable pageable);

     Page<Booking> findByHotelId(UUID hotelId, Pageable pageable);

     /**
      * Xóa theo hotelId
      */
     @Modifying
     @Transactional
     @Query("DELETE FROM Booking b WHERE b.hotel.id = :hotelId")
     void deleteByHotelId(@Param("hotelId") UUID hotelId);

     /**
      * SUM tổng số phòng đã được đặt cho 1 roomType trong khoảng [startDate,
      * endDate)
      * (loại trừ trạng thái CANCELLED).
      */
     @Query("SELECT COALESCE(SUM(b.numberOfRooms),0) FROM Booking b " +
               "WHERE b.roomType.id = :roomId " +
               "AND b.status <> com.example.hotelbookingserver.entities.constants.EBookingStatus.CANCELLED " +
               "AND b.checkInDate < :endDate " +
               "AND b.checkOutDate > :startDate")
     Integer sumRoomsBookedBetween(@Param("roomId") UUID roomId,
               @Param("startDate") LocalDate startDate,
               @Param("endDate") LocalDate endDate);

     /**
      * Phiên bản loại trừ 1 bookingId (dùng khi update booking để exclude chính
      * booking đó).
      */
     @Query("SELECT COALESCE(SUM(b.numberOfRooms),0) FROM Booking b " +
               "WHERE b.roomType.id = :roomId " +
               "AND b.id <> :excludeBookingId " +
               "AND b.status <> com.example.hotelbookingserver.entities.constants.EBookingStatus.CANCELLED " +
               "AND b.checkInDate < :endDate " +
               "AND b.checkOutDate > :startDate")
     Integer sumRoomsBookedBetweenExcludingBooking(@Param("roomId") UUID roomId,
               @Param("startDate") LocalDate startDate,
               @Param("endDate") LocalDate endDate,
               @Param("excludeBookingId") UUID excludeBookingId);
}
