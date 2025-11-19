package com.example.hotelbookingserver.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import com.example.hotelbookingserver.entities.mapper.BaseEntity;

import org.hibernate.annotations.BatchSize;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "hotels")
public class Hotel extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private String thumbnail;

    @Column(nullable = false)
    private String address;

    private String linkMap;

    private String description;

    @Column(nullable = false)
    private Float rate;

    private String checkInTime;

    private String checkOutTime;

    @OneToMany(mappedBy = "hotel", fetch = FetchType.LAZY)
    @BatchSize(size = 10)
    private Set<Image> images = new HashSet<>();

    @OneToMany(mappedBy = "hotel", fetch = FetchType.LAZY)
    @BatchSize(size = 10)
    private Set<RoomType> roomTypes = new HashSet<>();

    @OneToMany(mappedBy = "hotel", fetch = FetchType.LAZY)
    @BatchSize(size = 10)
    private Set<Reviews> reviews = new HashSet<>();

    @OneToMany(mappedBy = "hotel", fetch = FetchType.LAZY)
    @BatchSize(size = 10)
    private Set<Booking> bookings = new HashSet<>();

}