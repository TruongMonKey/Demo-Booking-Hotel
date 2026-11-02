package com.example.hotelbookingserver.dtos.responses;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoomTypeResponseDTO {
    private UUID id;
    private UUID hotelId;
    private String name;
    private Integer quantityBed;
    private Integer quantityPeople;
    private Integer roomArea;
    private Integer quantityRoom;
    private BigDecimal price;
    private List<AmenityDTO> amenities;
    private List<BookingResponseDTO> bookings;
    private List<String> imageFiles;
}
