package com.example.hotelbookingserver.repositories;

import com.example.hotelbookingserver.entities.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.UUID;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, UUID> {
    @Query("SELECT DISTINCT h FROM Hotel h " +
    "LEFT JOIN FETCH h.roomTypes rt " +
    "LEFT JOIN FETCH rt.amenities a " + 
    "LEFT JOIN FETCH h.images " +  
    "LEFT JOIN FETCH h.reviews")   
    List<Hotel> getListHotels();
}