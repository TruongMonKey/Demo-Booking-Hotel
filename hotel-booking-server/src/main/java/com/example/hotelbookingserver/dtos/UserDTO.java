package com.example.hotelbookingserver.dtos;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {
    private UUID id;
    private String email;
    private String name;
    private String phoneNumber;
    private List<String> roles;
    private List<BookingDTO> bookings = new ArrayList<>();

}
