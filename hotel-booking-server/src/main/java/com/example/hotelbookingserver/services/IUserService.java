package com.example.hotelbookingserver.services;

import java.util.UUID;

import com.example.hotelbookingserver.dtos.LoginRequest;
import com.example.hotelbookingserver.dtos.Response;
import com.example.hotelbookingserver.dtos.UserDTO;
import com.example.hotelbookingserver.entities.User;

public interface IUserService {
    Response register(User user);

    Response login(LoginRequest loginRequest);

    Response getAllUsers();

    Response getUserBookingHistory(UUID userId);

    Response deleteUser(UUID userId);

    Response getUserById(UUID userId);

    Response getMyInfo(String email);

    Response updateUserById(UUID userId, UserDTO dto);

}