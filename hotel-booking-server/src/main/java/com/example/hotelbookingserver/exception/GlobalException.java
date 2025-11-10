package com.example.hotelbookingserver.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.hotelbookingserver.entities.response.ResResponse;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(AdminCreationException.class)
    public ResponseEntity<ResResponse<Object>> handleAdminCreationException(AdminCreationException e) {
        ResResponse<Object> response = new ResResponse<>();
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setMessage("Admin creation failed: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(PermissionException.class)
    public ResponseEntity<ResResponse<Object>> handlePermissionException(PermissionException e) {
        ResResponse<Object> response = new ResResponse<>();
        response.setStatusCode(HttpStatus.FORBIDDEN.value());
        response.setMessage("Permission Denied: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(IdInvalidException.class)
    public ResponseEntity<ResResponse<Object>> handleIdInvalidException(IdInvalidException e) {
        ResResponse<Object> response = new ResResponse<>();
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setMessage("Invalid ID: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(OurException.class)
    public ResponseEntity<ResResponse<Object>> handleOurException(OurException e) {
        ResResponse<Object> response = new ResResponse<>();
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setMessage("Something went wrong: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResResponse<Object>> handleAllException(Exception e) {
        ResResponse<Object> response = new ResResponse<>();
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.setMessage("Internal Server Error: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}