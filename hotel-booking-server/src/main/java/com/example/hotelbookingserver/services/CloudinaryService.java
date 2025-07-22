package com.example.hotelbookingserver.services;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.hotelbookingserver.entities.Hotel;
import com.example.hotelbookingserver.entities.Image;
import com.example.hotelbookingserver.entities.RoomType;
import com.example.hotelbookingserver.repositories.ImageRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CloudinaryService implements ICloudiraryService {

    private final Cloudinary cloudinary;
    private final ImageRepository imageRepository;

    @Override
    public String uploadToCloudinary(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return uploadResult.get("secure_url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Upload to Cloudinary failed", e);
        }
    }

    @Override
    public Image uploadHotelImage(MultipartFile file, Hotel hotel) {
        String url = uploadToCloudinary(file);
        Image image = new Image();
        image.setHotel(hotel);
        image.setImageUrl(url);
        return imageRepository.save(image);
    }

    @Override
    public Image uploadRoomTypeImage(MultipartFile file, RoomType roomType) {
        String url = uploadToCloudinary(file);
        Image image = new Image();
        image.setRoomType(roomType);
        image.setImageUrl(url);
        return imageRepository.save(image);
    }

    @Override
    public List<Image> uploadRoomTypeImages(List<MultipartFile> files, RoomType roomType) {
        return files.stream()
                .map(file -> uploadRoomTypeImage(file, roomType))
                .collect(Collectors.toList());
    }

    @Override
    public List<Image> uploadHotelImages(List<MultipartFile> files, Hotel hotel) {
        return files.stream()
                .map(file -> uploadHotelImage(file, hotel))
                .collect(Collectors.toList());
    }

    public List<String> uploadMultipleFiles(List<MultipartFile> files) {
        return files.stream()
                .map(this::uploadToCloudinary)
                .collect(Collectors.toList());
    }
}