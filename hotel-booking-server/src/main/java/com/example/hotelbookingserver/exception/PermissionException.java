package com.example.hotelbookingserver.exception;

public class PermissionException extends RuntimeException {
    public PermissionException(String message) {
        super(message);
    }
}
