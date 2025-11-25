package com.example.hotelbookingserver.dtos;

import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {
    private UUID id;
    private int rating;
    private String content;
    private UUID hotelId;
    private UUID userId;
    private Instant createdAt;
    private Instant updatedAt;

    public ReviewDTO(UUID id, int rating, String content) {
        this.id = id;
        this.rating = rating;
        this.content = content;
    }

}
