package com.example.hotelbookingserver.dtos.responses;

import java.util.List;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {

    private UUID id;

    private String email;

    private String name;

    private String phone;

    private boolean active;

    private String address;

    private Integer age;

    private String gender;

    private List<RoleDTO> roles;

    private String createdAt;

    private String updatedAt;
}
