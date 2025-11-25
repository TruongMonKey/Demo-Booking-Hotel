package com.example.hotelbookingserver.services.impl;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.hotelbookingserver.dtos.ReviewDTO;
import com.example.hotelbookingserver.dtos.request.CreateReviewRequest;
import com.example.hotelbookingserver.dtos.request.UpdateReviewRequest;
import com.example.hotelbookingserver.dtos.response.Response;

public interface IReviewService {
    Response<ReviewDTO> createReview(CreateReviewRequest request);

    Response<ReviewDTO> getReviewById(UUID id);

    Response<Page<ReviewDTO>> getReviewsByHotel(UUID hotelId, Pageable pageable);

    Response<ReviewDTO> updateReview(UUID id, UpdateReviewRequest request);

    Response<Void> deleteReview(UUID id);
}
