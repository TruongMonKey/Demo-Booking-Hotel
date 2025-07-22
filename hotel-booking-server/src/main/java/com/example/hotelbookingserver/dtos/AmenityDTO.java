package com.example.hotelbookingserver.dtos;

import java.util.UUID;

import lombok.Data;

@Data
public class AmenityDTO {
    private UUID id;
    private String name;
    private UUID roomTypeId;

    public AmenityDTO() {
    }

    public AmenityDTO(UUID id, String name, UUID roomTypeId) {
        this.id = id;
        this.name = name;
        this.roomTypeId = roomTypeId;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UUID getRoomTypeId() {
        return roomTypeId;
    }

    public void setRoomTypeId(UUID roomTypeId) {
        this.roomTypeId = roomTypeId;
    }
}
