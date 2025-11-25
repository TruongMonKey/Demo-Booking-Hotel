package com.example.hotelbookingserver.dtos.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateReviewRequest {
    @Min(1)
    @Max(5)
    private Integer rating;

    @NotBlank
    private String content;
}
