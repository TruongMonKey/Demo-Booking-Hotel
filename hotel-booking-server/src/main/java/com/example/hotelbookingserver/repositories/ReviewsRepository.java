package com.example.hotelbookingserver.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.hotelbookingserver.entities.Reviews;

public interface ReviewsRepository extends JpaRepository<Reviews, UUID> {

}
