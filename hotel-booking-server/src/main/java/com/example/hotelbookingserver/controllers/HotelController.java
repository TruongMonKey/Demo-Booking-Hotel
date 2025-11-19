package com.example.hotelbookingserver.controllers;

import com.example.hotelbookingserver.services.HotelService;
import com.example.hotelbookingserver.dtos.HotelDTO;
import com.example.hotelbookingserver.dtos.response.Response;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hotels")
@CrossOrigin
public class HotelController {

    @Autowired
    private final HotelService hotelService;

    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    @GetMapping("/all")
    public ResponseEntity<Response<List<HotelDTO>>> getAllHotels() {
        Response<List<HotelDTO>> response = hotelService.getAllHotels();
        return ResponseEntity
                .status(response.getStatusCode())
                .body(response);
    }

    @GetMapping("/hotel-by-id/{id}")
    public ResponseEntity<Response<HotelDTO>> getHotelById(@PathVariable UUID id) {
        Response<HotelDTO> response = hotelService.getHotelById(id);
        return ResponseEntity
                .status(response.getStatusCode())
                .body(response);
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response<HotelDTO>> addHotel(@ModelAttribute HotelDTO requestDTO) {
        Response<HotelDTO> response = hotelService.addHotel(requestDTO);
        return ResponseEntity
                .status(response.getStatusCode())
                .body(response);
    }
}
