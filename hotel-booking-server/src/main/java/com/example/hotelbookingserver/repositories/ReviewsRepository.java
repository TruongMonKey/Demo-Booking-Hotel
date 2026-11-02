package com.example.hotelbookingserver.repositories;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hotelbookingserver.entities.Reviews;

public interface ReviewsRepository extends JpaRepository<Reviews, UUID> {

    Page<Reviews> findByHotelId(UUID hotelId, Pageable pageable);

    Page<Reviews> findByUserId(UUID userId, Pageable pageable);

    void deleteByHotelId(UUID hotelId);

    void deleteByUserId(UUID userId);

}
