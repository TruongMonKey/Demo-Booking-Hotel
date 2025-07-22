package com.example.hotelbookingserver.dtos;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class HotelDTO {
    private UUID id;
    private String name;
    private MultipartFile thumbnail;
    private String address;
    private String linkMap;
    private String description;
    private float rate;
    private String checkInTime;
    private String checkOutTime;
    private List<ImageDTO> images;
    private List<RoomTypeDTO> roomTypes;
    private List<ReviewsDTO> reviews;

    private List<MultipartFile> imageFiles;

}
