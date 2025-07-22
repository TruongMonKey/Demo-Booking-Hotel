package com.example.hotelbookingserver.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "hotels")
public class Hotel {
    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(columnDefinition = "CHAR(36)", updatable = false, nullable = false)
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String thumbnail;

    @Column(nullable = false)
    private String address;

    private String linkMap;

    private String description;

    @Column(nullable = false)
    private float rate;

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