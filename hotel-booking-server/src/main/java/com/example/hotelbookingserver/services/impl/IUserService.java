package com.example.hotelbookingserver.services.impl;

import java.util.List;
import java.util.UUID;

import com.example.hotelbookingserver.dtos.requests.BookingCreateRequest;
import com.example.hotelbookingserver.dtos.requests.UserCreateRequest;
import com.example.hotelbookingserver.dtos.responses.Response;
import com.example.hotelbookingserver.dtos.responses.UserResponseDTO;
import com.example.hotelbookingserver.entities.User;

public interface IUserService {

    Response<List<UserResponseDTO>> getAllUsers();

    Response<List<BookingCreateRequest>> getUserBookingHistory(UUID userId);

    Response<String> deleteUser(UUID userId);

    Response<UserResponseDTO> getUserById(UUID userId);

    Response<UserResponseDTO> getMyInfo(String email);

    Response<UserResponseDTO> updateUserById(UUID userId, UserResponseDTO dto);

    Response<UserResponseDTO> createUser(UserCreateRequest dto);

    // Các method nội bộ (không dùng Response)
    User handleGetUserByUsername(String username);

    void updateUserToken(String token, String email);

    User getUserByRefreshTokenAndEmail(String token, String email);

    boolean isEmailExist(String email);

    User handleCreateUser(User user);
}
