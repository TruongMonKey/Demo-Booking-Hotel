package com.example.hotelbookingserver.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotelbookingserver.dtos.BookingDTO;
import com.example.hotelbookingserver.dtos.UserDTO;
import com.example.hotelbookingserver.dtos.response.Response;
import com.example.hotelbookingserver.services.impl.IUserService;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    @Autowired
    private IUserService userService;

    @GetMapping("/all")
    public ResponseEntity<Response<List<UserDTO>>> getAllUsers() {
        Response<List<UserDTO>> response = userService.getAllUsers();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-by-id/{userId}")
    public ResponseEntity<Response<UserDTO>> getUserById(@PathVariable("userId") UUID userId) {
        Response<UserDTO> response = userService.getUserById(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<Response<UserDTO>> updateUser(@PathVariable UUID userId,
            @RequestBody UserDTO dto) {
        Response<UserDTO> response = userService.updateUserById(userId, dto);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Response<String>> deleteUSer(@PathVariable("userId") UUID userId) {
        Response<String> response = userService.deleteUser(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-logged-in-profile-info")
    public ResponseEntity<Response<UserDTO>> getLoggedInUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Response<UserDTO> response = userService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/get-user-bookings/{userId}")
    public ResponseEntity<Response<List<BookingDTO>>> getUserBookingHistory(
            @PathVariable("userId") UUID userId) {

        Response<List<BookingDTO>> response = userService.getUserBookingHistory(userId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
