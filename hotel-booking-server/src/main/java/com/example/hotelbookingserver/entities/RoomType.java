package com.example.hotelbookingserver.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

@Entity
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Table(name = "room_types")
public class RoomType {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(columnDefinition = "CHAR(36)", updatable = false, nullable = false)
    @JdbcTypeCode(SqlTypes.CHAR)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(name = "quantity_bed", nullable = false)
    private int quantityBed;

    @Column(name = "quantity_people", nullable = false)
    private int quantityPeople;

    @Column(name = "room_area", nullable = false)
    private int roomArea;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "quantity_room")
    private int quantityRoom;

    @OneToMany(mappedBy = "roomType", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @BatchSize(size = 10)
    private List<Amenity> amenities = new ArrayList<>();

    @OneToMany(mappedBy = "roomType", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Booking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "roomType", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Image> images = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

}
