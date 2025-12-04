package com.example.hotelbookingserver.dtos.requests;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class ReviewCreateRequest {
    @Min(1)
    @Max(5)
    @NotNull
    private Integer rating;

    @NotBlank
    private String content;

    @NotNull
    private UUID hotelId;

    @NotNull
    private UUID userId;
}
