package com.example.hotelbookingserver.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.hotelbookingserver.dtos.Response;
import com.example.hotelbookingserver.entities.Hotel;
import com.example.hotelbookingserver.entities.Image;
import com.example.hotelbookingserver.repositories.HotelRepository;
import com.example.hotelbookingserver.services.CloudinaryService;

@RestController
@RequestMapping("/images")
@CrossOrigin
public class ImageUploadController {

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired 
    private HotelRepository hotelRepository;

    // Upload 1 ảnh → trả về URL

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        String url = cloudinaryService.uploadToCloudinary(file);
        return ResponseEntity.ok(url);
    }

    // Upload nhiều ảnh → trả về danh sách URL

    @PostMapping("/upload-multiple")
    public ResponseEntity<List<String>> uploadImages(@RequestParam("files") List<MultipartFile> files) {
        List<String> urls = cloudinaryService.uploadMultipleFiles(files);
        return ResponseEntity.ok(urls);
    }

    @PostMapping(value = "/upload-hotel-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response> uploadHotelImages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("hotelId") UUID hotelId) {

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        List<Image> images = cloudinaryService.uploadHotelImages(files, hotel);

        Response response = new Response();
        response.setStatusCode(201);
        response.setMessage("Uploaded " + images.size() + " images successfully");

        return ResponseEntity.ok(response);
    }
}
