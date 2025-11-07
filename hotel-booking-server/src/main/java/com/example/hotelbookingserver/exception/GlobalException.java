package com.example.hotelbookingserver.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.hotelbookingserver.entities.response.ResResponse;

@RestControllerAdvice
public class GlobalException {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResResponse<Object>> handleAllException(Exception e) {
        ResResponse<Object> response = new ResResponse<Object>();
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.setMessage("Internal Server Error: " + e.getMessage());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @ExceptionHandler(AdminCreationException.class)
    public ResponseEntity<ResResponse<Object>> handleAdminCreationException(AdminCreationException e) {
    ResResponse<Object> response = new ResResponse<>();
    response.setStatusCode(HttpStatus.BAD_REQUEST.value());
    response.setMessage("Admin creation failed: " + e.getMessage());
    return ResponseEntity.status(response.getStatusCode()).body(response);
}
}
