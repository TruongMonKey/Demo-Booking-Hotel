package com.example.hotelbookingserver.dtos.responses;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Minimal room type information for embedding in other responses.
 * Used to reduce payload size and prevent circular references.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomTypeMinimalDTO {
    private UUID id;
    private String name;
    private BigDecimal price;
    private Integer quantityBed;
    private Integer quantityRoom;
}
