package com.example.hotelbookingserver.controllers;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.hotelbookingserver.dtos.ReviewDTO;
import com.example.hotelbookingserver.dtos.request.CreateReviewRequest;
import com.example.hotelbookingserver.dtos.request.UpdateReviewRequest;
import com.example.hotelbookingserver.dtos.response.Response;
import com.example.hotelbookingserver.services.ReviewService;

import java.util.UUID;

@RestController
@RequestMapping("/reviews")
@CrossOrigin
public class ReviewsController {

    @Autowired
    private ReviewService reviewsService;

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Response<ReviewDTO>> createReview(@Valid @RequestBody CreateReviewRequest request) {
        Response<ReviewDTO> resp = reviewsService.createReview(request);
        return ResponseEntity.status(resp.getStatusCode()).body(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response<ReviewDTO>> getReviewById(@PathVariable UUID id) {
        Response<ReviewDTO> resp = reviewsService.getReviewById(id);
        return ResponseEntity.status(resp.getStatusCode()).body(resp);
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<Response<Page<ReviewDTO>>> getReviewsByHotel(
            @PathVariable UUID hotelId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Response<Page<ReviewDTO>> resp = reviewsService.getReviewsByHotel(hotelId, pageable);
        return ResponseEntity.status(resp.getStatusCode()).body(resp);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response<ReviewDTO>> updateReview(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateReviewRequest request) {
        Response<ReviewDTO> resp = reviewsService.updateReview(id, request);
        return ResponseEntity.status(resp.getStatusCode()).body(resp);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response<Void>> deleteReview(@PathVariable UUID id) {
        Response<Void> resp = reviewsService.deleteReview(id);
        return ResponseEntity.status(resp.getStatusCode()).body(resp);
    }
}