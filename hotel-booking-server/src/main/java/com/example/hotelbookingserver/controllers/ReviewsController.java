package com.example.hotelbookingserver.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.hotelbookingserver.dtos.requests.ReviewCreateRequest;
import com.example.hotelbookingserver.dtos.requests.ReviewUpdateRequest;
import com.example.hotelbookingserver.dtos.responses.Response;
import com.example.hotelbookingserver.dtos.responses.ReviewResponseDTO;
import com.example.hotelbookingserver.services.ReviewService;

import java.util.UUID;

@RestController
@RequestMapping("/reviews")
@CrossOrigin
public class ReviewsController {

    @Autowired
    private ReviewService reviewsService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Response<ReviewResponseDTO>> createReview(@Valid @RequestBody ReviewCreateRequest request) {
        Response<ReviewResponseDTO> resp = reviewsService.createReview(request);
        return ResponseEntity.status(resp.getStatusCode()).body(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<ReviewResponseDTO>> getReviewById(@PathVariable UUID id) {
        Response<ReviewResponseDTO> resp = reviewsService.getReviewById(id);
        return ResponseEntity.status(resp.getStatusCode()).body(resp);
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<Response<Page<ReviewResponseDTO>>> getReviewsByHotel(
            @PathVariable UUID hotelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Response<Page<ReviewResponseDTO>> resp = reviewsService.getReviewsByHotel(hotelId, pageable);
        return ResponseEntity.status(resp.getStatusCode()).body(resp);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response<ReviewResponseDTO>> updateReview(
            @PathVariable UUID id,
            @Valid @RequestBody ReviewUpdateRequest request) {
        Response<ReviewResponseDTO> resp = reviewsService.updateReview(id, request);
        return ResponseEntity.status(resp.getStatusCode()).body(resp);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response<Void>> deleteReview(@PathVariable UUID id) {
        Response<Void> resp = reviewsService.deleteReview(id);
        return ResponseEntity.status(resp.getStatusCode()).body(resp);
    }
}