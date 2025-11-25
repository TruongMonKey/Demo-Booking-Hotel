package com.example.hotelbookingserver.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Response<T> {
    private int statusCode;
    private String message;
    private T data;
}
