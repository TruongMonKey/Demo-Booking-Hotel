package com.example.hotelbookingserver.services;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.example.hotelbookingserver.entities.Hotel;
import com.example.hotelbookingserver.entities.Image;
import com.example.hotelbookingserver.entities.RoomType;

public interface ICloudiraryService {

    String uploadToCloudinary(MultipartFile file);

    Image uploadHotelImage(MultipartFile file, Hotel hotel);

    Image uploadRoomTypeImage(MultipartFile file, RoomType roomType);

    List<Image> uploadRoomTypeImages(List<MultipartFile> files, RoomType roomType);

    List<Image> uploadHotelImages(List<MultipartFile> files, Hotel hotel);
}
