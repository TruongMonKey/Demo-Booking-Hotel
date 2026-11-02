package com.example.hotelbookingserver.controllers;

import com.example.hotelbookingserver.services.HotelService;
import com.example.hotelbookingserver.dtos.responses.HotelResponseDTO;
import com.example.hotelbookingserver.dtos.responses.Response;

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
    public ResponseEntity<Response<List<HotelResponseDTO>>> getAllHotels() {
        Response<List<HotelResponseDTO>> response = hotelService.getAllHotels();
        return ResponseEntity
                .status(response.getStatusCode())
                .body(response);
    }

    @GetMapping("/hotel-by-id/{id}")
    public ResponseEntity<Response<HotelResponseDTO>> getHotelById(@PathVariable UUID id) {
        Response<HotelResponseDTO> response = hotelService.getHotelById(id);
        return ResponseEntity
                .status(response.getStatusCode())
                .body(response);
    }

    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response<HotelResponseDTO>> addHotel(@ModelAttribute HotelResponseDTO requestDTO) {
        Response<HotelResponseDTO> response = hotelService.addHotel(requestDTO);
        return ResponseEntity
                .status(response.getStatusCode())
                .body(response);
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response<HotelResponseDTO>> updateHotel(
            @PathVariable UUID id,
            @ModelAttribute HotelResponseDTO requestDTO) {
        requestDTO.setId(id);
        Response<HotelResponseDTO> response = hotelService.updateHotel(id, requestDTO);
        return ResponseEntity
                .status(response.getStatusCode())
                .body(response);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response<Void>> deleteHotel(@PathVariable UUID id) {
        Response<Void> response = hotelService.deleteHotel(id);
        return ResponseEntity
                .status(response.getStatusCode())
                .body(response);
    }
}
