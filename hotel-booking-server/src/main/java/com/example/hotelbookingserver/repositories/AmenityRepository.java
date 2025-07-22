package com.example.hotelbookingserver.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hotelbookingserver.entities.Amenity;
import com.example.hotelbookingserver.entities.RoomType;

public interface AmenityRepository extends JpaRepository<Amenity, UUID> {

    List<Amenity> findByRoomType(RoomType roomType);
}
