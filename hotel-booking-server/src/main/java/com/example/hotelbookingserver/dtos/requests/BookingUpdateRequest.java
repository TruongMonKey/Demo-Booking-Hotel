package com.example.hotelbookingserver.dtos.requests;

import java.time.LocalDate;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingUpdateRequest {
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer guests;
    private Integer rooms;
    private String status; // allow admin updates like "CANCELLED"
}
