package com.example.hotelbookingserver.services.impl;

import java.util.List;
import java.util.UUID;

import com.example.hotelbookingserver.dtos.response.Response;
import com.example.hotelbookingserver.dtos.UserDTO;
import com.example.hotelbookingserver.dtos.BookingDTO;
import com.example.hotelbookingserver.entities.User;

public interface IUserService {

    Response<List<UserDTO>> getAllUsers();

    Response<List<BookingDTO>> getUserBookingHistory(UUID userId);

    Response<String> deleteUser(UUID userId);

    Response<UserDTO> getUserById(UUID userId);

    Response<UserDTO> getMyInfo(String email);

    Response<UserDTO> updateUserById(UUID userId, UserDTO dto);

    // Các method nội bộ (không dùng Response)
    User handleGetUserByUsername(String username);

    void updateUserToken(String token, String email);

    User getUserByRefreshTokenAndEmail(String token, String email);

    boolean isEmailExist(String email);

    User handleCreateUser(User user);
}
