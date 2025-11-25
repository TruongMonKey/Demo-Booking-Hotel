package com.example.hotelbookingserver.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.hotelbookingserver.entities.Image;
import com.example.hotelbookingserver.entities.RoomType;

@Repository
public interface ImageRepository extends JpaRepository<Image, UUID> {

    void deleteByRoomType(RoomType roomType);

    void deleteByHotelId(@Param("hotelId") UUID hotelId);
}
