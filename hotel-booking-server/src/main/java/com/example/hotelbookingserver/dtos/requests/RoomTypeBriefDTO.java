package com.example.hotelbookingserver.dtos.request;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Data;

@Data
public class RoomTypeBriefDTO {
    private UUID id;
    private String name;
    private BigDecimal price;
}
