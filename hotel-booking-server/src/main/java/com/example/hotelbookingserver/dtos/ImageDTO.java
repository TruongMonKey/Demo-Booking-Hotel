package com.example.hotelbookingserver.dtos;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class ImageDTO {
    private UUID id;
    private String imageUrl;
    private MultipartFile file;

    public ImageDTO(UUID id, String imageUrl) {
        this.id = id;
        this.imageUrl = imageUrl;
    }

}
