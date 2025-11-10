package com.example.hotelbookingserver.entities.response;

import java.time.Instant;
import java.util.UUID;

import com.example.hotelbookingserver.entities.constants.EGender;
import lombok.Getter;
import lombok.Setter;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResCreateUserDTO {
    private UUID id;
    private String name;
    private String email;
    private int age;
    private EGender gender;
    private String address;
    private Instant createAt;
}
