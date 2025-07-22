package com.example.hotelbookingserver.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotelbookingserver.dtos.AmenityDTO;
import com.example.hotelbookingserver.dtos.Response;
import com.example.hotelbookingserver.services.IAmenityService;

@RestController
@RequestMapping("/amenities")
@CrossOrigin
public class AmentityController {
    @Autowired
    private IAmenityService amenityService;

    // Tạo amenity
    @PostMapping
    public ResponseEntity<Response> createAmenity(@RequestBody AmenityDTO request) {
        Response response = amenityService.createAmenity(request.getName(), request.getRoomTypeId());
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Cập nhật
    @PutMapping("/{id}")
    public ResponseEntity<Response> updateAmenity(
            @PathVariable UUID id,
            @RequestBody AmenityDTO amenityDTO) {

        // Lấy name từ DTO
        String name = amenityDTO.getName();

        Response response = amenityService.updateAmenity(id, name);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Xoá
    @DeleteMapping("/{id}")
    public ResponseEntity<Response> deleteAmenity(@PathVariable UUID id) {
        Response response = amenityService.deleteAmenity(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Lấy danh sách
    @GetMapping("/by-room-type/{roomTypeId}")
    public ResponseEntity<Response> getAmenitiesByRoomTypeId(@PathVariable UUID roomTypeId) {
        Response response = amenityService.getAmenitiesByRoomTypeId(roomTypeId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
