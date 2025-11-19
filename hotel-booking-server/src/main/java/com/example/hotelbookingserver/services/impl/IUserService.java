package com.example.hotelbookingserver.services.impl;

import java.util.UUID;

import com.example.hotelbookingserver.dtos.response.Response;
import com.example.hotelbookingserver.dtos.UserDTO;
import com.example.hotelbookingserver.entities.User;

public interface IUserService {

    Response getAllUsers();

    Response getUserBookingHistory(UUID userId);

    Response deleteUser(UUID userId);

    Response getUserById(UUID userId);

    Response getMyInfo(String email);

    Response updateUserById(UUID userId, UserDTO dto);

    User handleGetUserByUsername(String username);

    void updateUserToken(String token, String email);

    User getUserByRefreshTokenAndEmail(String token, String email);

    boolean isEmailExist(String email);

    User handleCreateUser(User user);

}