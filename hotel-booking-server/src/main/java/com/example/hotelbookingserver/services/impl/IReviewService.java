package com.example.hotelbookingserver.services.impl;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.hotelbookingserver.dtos.requests.ReviewCreateRequest;
import com.example.hotelbookingserver.dtos.requests.ReviewUpdateRequest;
import com.example.hotelbookingserver.dtos.responses.Response;
import com.example.hotelbookingserver.dtos.responses.ReviewResponseDTO;

public interface IReviewService {
    Response<ReviewResponseDTO> createReview(ReviewCreateRequest request);

    Response<ReviewResponseDTO> getReviewById(UUID id);

    Response<Page<ReviewResponseDTO>> getReviewsByHotel(UUID hotelId, Pageable pageable);

    Response<ReviewResponseDTO> updateReview(UUID id, ReviewUpdateRequest request);

    Response<Void> deleteReview(UUID id);
}
