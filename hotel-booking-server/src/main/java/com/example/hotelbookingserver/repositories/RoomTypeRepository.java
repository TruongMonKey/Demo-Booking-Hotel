package com.example.hotelbookingserver.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.hotelbookingserver.entities.RoomType;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, UUID> {

  @Query("SELECT DISTINCT r.name FROM RoomType r")
  List<String> findDistinctRoomTypeNames();

  @Query("""
      SELECT r FROM RoomType r
      WHERE r.name LIKE %:roomType%
        AND (
          SELECT COUNT(bk) FROM Booking bk
          WHERE bk.roomType = r
            AND bk.checkInDate <= :checkOutDate
            AND bk.checkOutDate >= :checkInDate
        ) < r.quantityRoom
      """)
  List<RoomType> findAvailableRoomsByDatesAndTypes(LocalDate checkInDate, LocalDate checkOutDate, String roomType);

  @Query("""
          SELECT r FROM RoomType r
          WHERE (
            SELECT COUNT(b) FROM Booking b
            WHERE b.roomType = r
              AND b.checkInDate <= :checkOutDate
              AND b.checkOutDate >= :checkInDate
          ) < r.quantityRoom
      """)
  List<RoomType> getAllAvailableRoomsByDate(LocalDate checkInDate, LocalDate checkOutDate);
}
