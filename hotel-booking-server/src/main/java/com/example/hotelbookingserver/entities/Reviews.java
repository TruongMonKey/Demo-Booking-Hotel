package com.example.hotelbookingserver.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

import com.example.hotelbookingserver.entities.mapper.BaseEntity;

@Entity
@Table(name = "reviews")
@Getter
@Setter
public class Reviews extends BaseEntity {

    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private int rating;

    @Column(nullable = false)
    private String content;

    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = true)
    private Hotel hotel;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

}
