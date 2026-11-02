package com.example.hotelbookingserver.dtos.responses;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Generic API response wrapper.
 * 
 * @param <T> Type of data being returned
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response<T> {
    private int statusCode;
    private String message;
    private T data;
    private long timestamp;
    private String requestId;
    private List<String> errors;
}
