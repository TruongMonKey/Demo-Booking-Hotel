package com.example.hotelbookingserver.dtos.responses;

import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDetailResponseDTO {
    private UUID id;
    private String name;
    private String email;
    private String phoneNumber;
    private List<String> roles;
    private List<BookingResponseDTO> bookings;
}
