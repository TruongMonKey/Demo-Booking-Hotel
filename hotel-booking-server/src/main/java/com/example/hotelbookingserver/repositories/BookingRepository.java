package com.example.hotelbookingserver.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.hotelbookingserver.entities.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {

}
