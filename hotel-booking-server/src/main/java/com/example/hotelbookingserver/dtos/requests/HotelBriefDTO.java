package com.example.hotelbookingserver.dtos.request;

import java.util.UUID;

import lombok.Data;

@Data
public class HotelBriefDTO {
    private UUID id;
    private String name;
    private String address;
    private String thumbnail;
}
