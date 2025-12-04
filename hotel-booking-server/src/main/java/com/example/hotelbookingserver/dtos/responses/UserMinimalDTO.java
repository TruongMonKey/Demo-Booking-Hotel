package com.example.hotelbookingserver.dtos.responses;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserMinimalDTO {
    private UUID id;
    private String email;
    private String name;
}
