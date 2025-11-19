package com.example.hotelbookingserver.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.hotelbookingserver.dtos.AmenityDTO;
import com.example.hotelbookingserver.dtos.response.Response;
import com.example.hotelbookingserver.services.impl.IAmenityService;

@RestController
@RequestMapping("/api/amenities")
@CrossOrigin
public class AmenityController {
    @Autowired
    private IAmenityService amenityService;

    // ========================= CREATE =========================
    @PostMapping("/create")
    public ResponseEntity<Response<AmenityDTO>> createAmenity(
            @RequestParam String name,
            @RequestParam UUID roomTypeId) {

        Response<AmenityDTO> response = amenityService.createAmenity(name, roomTypeId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // ========================= UPDATE =========================
    @PutMapping("/update/{id}")
    public ResponseEntity<Response<AmenityDTO>> updateAmenity(
            @PathVariable UUID id,
            @RequestParam String name) {

        Response<AmenityDTO> response = amenityService.updateAmenity(id, name);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // ========================= DELETE =========================
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response<Void>> deleteAmenity(
            @PathVariable UUID id) {

        Response<Void> response = amenityService.deleteAmenity(id);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // ========================= GET BY ROOM TYPE =========================
    @GetMapping("/room-type/{roomTypeId}")
    public ResponseEntity<Response<List<AmenityDTO>>> getAmenitiesByRoomType(
            @PathVariable UUID roomTypeId) {

        Response<List<AmenityDTO>> response = amenityService.getAmenitiesByRoomTypeId(roomTypeId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
