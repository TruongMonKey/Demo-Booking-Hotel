package com.example.hotelbookingserver.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.hotelbookingserver.dtos.response.Response;

@RestControllerAdvice
public class GlobalException {

    @ExceptionHandler(AdminCreationException.class)
    public ResponseEntity<Response<Object>> handleAdminCreationException(AdminCreationException e) {
        Response<Object> response = new Response<>();
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setMessage("Admin creation failed: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(PermissionException.class)
    public ResponseEntity<Response<Object>> handlePermissionException(PermissionException e) {
        Response<Object> response = new Response<>();
        response.setStatusCode(HttpStatus.FORBIDDEN.value());
        response.setMessage("Permission Denied: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(IdInvalidException.class)
    public ResponseEntity<Response<Object>> handleIdInvalidException(IdInvalidException e) {
        Response<Object> response = new Response<>();
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setMessage("Invalid ID: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(OurException.class)
    public ResponseEntity<Response<Object>> handleOurException(OurException e) {
        Response<Object> response = new Response<>();
        response.setStatusCode(HttpStatus.BAD_REQUEST.value());
        response.setMessage("Something went wrong: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Response<Void>> handleNotFound(ResourceNotFoundException ex) {
        Response<Void> resp = new Response<>();
        resp.setStatusCode(404);
        resp.setMessage(ex.getMessage());
        resp.setData(null);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Response<Object>> handleAllException(Exception e) {
        Response<Object> response = new Response<>();
        response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.setMessage("Internal Server Error: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}