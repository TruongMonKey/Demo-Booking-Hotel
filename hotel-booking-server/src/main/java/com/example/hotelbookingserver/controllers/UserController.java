package com.example.hotelbookingserver.controllers;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.hotelbookingserver.dtos.requests.UserUpdateRequest;
import com.example.hotelbookingserver.dtos.requests.BookingCreateRequest;
import com.example.hotelbookingserver.dtos.requests.UserCreateRequest;
import com.example.hotelbookingserver.dtos.responses.Response;
import com.example.hotelbookingserver.dtos.responses.UserResponseDTO;
import com.example.hotelbookingserver.services.impl.IUserService;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin
public class UserController {

    @Autowired
    private IUserService userService;

    @GetMapping()
    public ResponseEntity<Response<List<UserResponseDTO>>> getAllUsers() {
        Response<List<UserResponseDTO>> response = userService.getAllUsers();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping(value = "/{userId}")
    public ResponseEntity<Response<UserResponseDTO>> getUserById(@PathVariable("userId") UUID userId) {
        Response<UserResponseDTO> response = userService.getUserById(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping(value = "/{userId}")
    public ResponseEntity<Response<UserResponseDTO>> updateUser(
            @PathVariable("userId") UUID userId,
            @Valid @RequestBody UserUpdateRequest dto) {
        UserResponseDTO userDTO = new UserResponseDTO();
        userDTO.setName(dto.getName());
        userDTO.setEmail(dto.getEmail());
        userDTO.setAge(dto.getAge());

        Response<UserResponseDTO> response = userService.updateUserById(userId, userDTO);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping(value = "/{userId}")
    public ResponseEntity<Response<String>> deleteUser(@PathVariable("userId") UUID userId) {
        Response<String> response = userService.deleteUser(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping(value = "/me")
    public ResponseEntity<Response<UserResponseDTO>> getLoggedInUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Response<UserResponseDTO> response = userService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping(value = "/{userId}/bookings")
    public ResponseEntity<Response<List<BookingCreateRequest>>> getUserBookingHistory(
            @PathVariable("userId") UUID userId) {

        Response<List<BookingCreateRequest>> response = userService.getUserBookingHistory(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PostMapping()
    public ResponseEntity<Response<UserResponseDTO>> createUser(@Valid @RequestBody UserCreateRequest dto) {
        Response<UserResponseDTO> response = userService.createUser(dto);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
