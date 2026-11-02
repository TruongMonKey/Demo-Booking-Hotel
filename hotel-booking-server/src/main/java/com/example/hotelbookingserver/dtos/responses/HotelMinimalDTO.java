package com.example.hotelbookingserver.dtos.responses;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Minimal hotel information for embedding in other responses.
 * Used to reduce payload size and prevent circular references.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelMinimalDTO {
    private UUID id;
    private String name;
    private String address;
    private String thumbnailUrl;
}
