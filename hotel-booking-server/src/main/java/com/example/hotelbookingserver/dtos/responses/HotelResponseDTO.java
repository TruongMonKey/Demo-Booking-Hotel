package com.example.hotelbookingserver.dtos.responses;

import java.util.UUID;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HotelResponseDTO {

    private UUID id;
    private String name;
    private String thumbnailUrl;
    private String address;
    private String linkMap;
    private String description;
    private java.math.BigDecimal rate;
    private String checkInTime;
    private String checkOutTime;
    private List<ImageDTO> images;
    private List<RoomTypeResponseDTO> roomTypes;
    private List<ReviewResponseDTO> reviews;
}
