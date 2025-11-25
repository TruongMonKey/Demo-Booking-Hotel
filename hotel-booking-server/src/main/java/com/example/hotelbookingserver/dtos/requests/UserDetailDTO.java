package com.example.hotelbookingserver.dtos.request;

import java.util.List;
import java.util.UUID;

import lombok.Data;

@Data
public class UserDetailDTO {
    private UUID id;
    private String name;
    private String email;
    private String phoneNumber;
    private List<String> roles;
    private List<BookingShortDTO> bookings;
}
