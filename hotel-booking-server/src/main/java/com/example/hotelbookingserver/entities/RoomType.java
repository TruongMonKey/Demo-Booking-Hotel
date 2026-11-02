package com.example.hotelbookingserver.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import com.example.hotelbookingserver.entities.mapper.BaseEntity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "room_types")
@Getter
@Setter
public class RoomType extends BaseEntity {

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

    @OneToMany(mappedBy = "roomType", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Amenity> amenities = new ArrayList<>();

    @OneToMany(mappedBy = "roomType", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Booking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "roomType", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Image> images = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id", nullable = false)
    private Hotel hotel;

}
