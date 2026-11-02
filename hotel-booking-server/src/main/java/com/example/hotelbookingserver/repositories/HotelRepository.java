package com.example.hotelbookingserver.repositories;

import com.example.hotelbookingserver.entities.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, UUID> {

        // NOTE: Avoid join-fetching multiple collection associations in the same query
        // to prevent
        // Hibernate "multiple bag fetch" / "Could not generate fetch" issues.
        // For list endpoints we fetch only images and reviews; detailed relations
        // (roomTypes, amenities, bookings)
        // are loaded by findByIdWithRelations for single-hotel requests.
        @Query("SELECT DISTINCT h FROM Hotel h " +
                        "LEFT JOIN FETCH h.images i " +
                        "LEFT JOIN FETCH h.reviews r")
        List<Hotel> getListHotels();

        @Query("SELECT h FROM Hotel h " +
                        "LEFT JOIN FETCH h.images i " +
                        "LEFT JOIN FETCH h.roomTypes rt " +
                        "LEFT JOIN FETCH rt.amenities a " +
                        "LEFT JOIN FETCH rt.bookings b " +
                        "LEFT JOIN FETCH h.reviews r " +
                        "WHERE h.id = :id")
        Optional<Hotel> findByIdWithRelations(@Param("id") UUID id);

}