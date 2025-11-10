package com.example.hotelbookingserver.dtos.response;

import java.time.LocalDateTime;
import java.util.UUID;

import com.example.hotelbookingserver.entities.constants.EGender;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResCreateUserDTO {

    private UUID id;
    private String name;
    private String email;
    private int age;
    private EGender gender;
    private String address;
    private LocalDateTime createdAt;
}
