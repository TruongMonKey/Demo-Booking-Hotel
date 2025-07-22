package com.example.hotelbookingserver.services;

import java.util.UUID;

import com.example.hotelbookingserver.dtos.Response;

public interface IAmenityService {

    Response createAmenity(String name, UUID roomTypeId);

    Response updateAmenity(UUID id, String name);

    Response deleteAmenity(UUID id);

    Response getAmenitiesByRoomTypeId(UUID roomTypeId);
}
