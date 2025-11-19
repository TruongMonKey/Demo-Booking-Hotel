package com.example.hotelbookingserver.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import com.example.hotelbookingserver.entities.mapper.BaseEntity;

@Entity
@Table(name = "amenities")
@Getter
@Setter
public class Amenity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    @Column(nullable = false)
    private String name;

}
