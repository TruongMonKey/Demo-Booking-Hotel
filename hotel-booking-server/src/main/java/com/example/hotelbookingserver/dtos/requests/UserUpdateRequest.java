package com.example.hotelbookingserver.dtos.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    @Email
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Phone is required")
    private String phone;

    private String address;

    @Min(0)
    private Integer age;

    private String gender;

    private Boolean active;
}
