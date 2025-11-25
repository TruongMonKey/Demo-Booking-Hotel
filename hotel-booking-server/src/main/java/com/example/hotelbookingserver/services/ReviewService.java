package com.example.hotelbookingserver.services;

import org.springframework.stereotype.Service;

import com.example.hotelbookingserver.dtos.ReviewDTO;
import com.example.hotelbookingserver.dtos.request.CreateReviewRequest;
import com.example.hotelbookingserver.dtos.request.UpdateReviewRequest;
import com.example.hotelbookingserver.dtos.response.Response;
import com.example.hotelbookingserver.entities.Hotel;
import com.example.hotelbookingserver.entities.Reviews;
import com.example.hotelbookingserver.entities.User;
import com.example.hotelbookingserver.exception.ResourceNotFoundException;
import com.example.hotelbookingserver.repositories.HotelRepository;
import com.example.hotelbookingserver.repositories.ReviewsRepository;
import com.example.hotelbookingserver.repositories.UserRepository;
import com.example.hotelbookingserver.services.impl.IReviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;
import java.util.function.Function;

@Service
public class ReviewService implements IReviewService {

    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    @Autowired
    private ReviewsRepository reviewsRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private UserRepository userRepository;

    private final Function<Reviews, ReviewDTO> toDto = r -> {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(r.getId());
        dto.setRating(r.getRating());
        dto.setContent(r.getContent());
        dto.setHotelId(r.getHotel() != null ? r.getHotel().getId() : null);
        dto.setUserId(r.getUser() != null ? r.getUser().getId() : null);
        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    };

    @Override
    @Transactional
    public Response<ReviewDTO> createReview(CreateReviewRequest request) {
        Response<ReviewDTO> resp = new Response<>();
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found with id: " + request.getHotelId()));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Reviews review = new Reviews();
        review.setRating(request.getRating());
        review.setContent(request.getContent());
        review.setHotel(hotel);
        review.setUser(user);
        review.setCreatedAt(Instant.now());
        review.setUpdatedAt(Instant.now());

        Reviews saved = reviewsRepository.save(review);

        resp.setStatusCode(201);
        resp.setMessage("Create review successfully");
        resp.setData(toDto.apply(saved));
        return resp;
    }

    @Override
    public Response<ReviewDTO> getReviewById(UUID id) {
        Response<ReviewDTO> resp = new Response<>();
        Reviews r = reviewsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        resp.setStatusCode(200);
        resp.setMessage("Get review successfully");
        resp.setData(toDto.apply(r));
        return resp;
    }

    @Override
    public Response<Page<ReviewDTO>> getReviewsByHotel(UUID hotelId, Pageable pageable) {
        Response<Page<ReviewDTO>> resp = new Response<>();
        // check hotel exists (optional)
        if (!hotelRepository.existsById(hotelId)) {
            throw new ResourceNotFoundException("Hotel not found with id: " + hotelId);
        }
        Page<Reviews> page = reviewsRepository.findByHotelId(hotelId, pageable);
        Page<ReviewDTO> dtoPage = page.map(toDto);
        resp.setStatusCode(200);
        resp.setMessage("Get reviews by hotel successfully");
        resp.setData(dtoPage);
        return resp;
    }

    @Override
    @Transactional
    public Response<ReviewDTO> updateReview(UUID id, UpdateReviewRequest request) {
        Response<ReviewDTO> resp = new Response<>();
        Reviews existing = reviewsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));

        if (request.getRating() != null)
            existing.setRating(request.getRating());
        if (request.getContent() != null && !request.getContent().isBlank())
            existing.setContent(request.getContent());

        existing.setUpdatedAt(Instant.now());
        Reviews saved = reviewsRepository.save(existing);

        resp.setStatusCode(200);
        resp.setMessage("Update review successfully");
        resp.setData(toDto.apply(saved));
        return resp;
    }

    @Override
    @Transactional
    public Response<Void> deleteReview(UUID id) {
        Response<Void> resp = new Response<>();
        Reviews existing = reviewsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + id));
        reviewsRepository.delete(existing);
        resp.setStatusCode(200);
        resp.setMessage("Delete review successfully");
        resp.setData(null);
        return resp;
    }
}
