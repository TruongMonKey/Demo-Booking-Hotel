package com.example.hotelbookingserver.entities.response;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResResponse<T> {
    private int statusCode;
    private boolean success;
    private String message;
    private String error;
    private T data;
    private Instant timestamp;

    public ResResponse() {
        this.timestamp = Instant.now();
    }

    public ResResponse(int statusCode, boolean success, String message, String error, T data) {
        this.statusCode = statusCode;
        this.success = success;
        this.message = message;
        this.error = error;
        this.data = data;
        this.timestamp = Instant.now();
    }

    public static <T> ResResponse<T> success(int status, String msg, T data) {
        return new ResResponse<>(status, true, msg, null, data);
    }

    public static <T> ResResponse<T> error(int status, String msg, String error) {
        return new ResResponse<>(status, false, msg, error, null);
    }

}