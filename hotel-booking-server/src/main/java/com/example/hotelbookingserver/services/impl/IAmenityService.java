package com.example.hotelbookingserver.services.impl;

import java.util.List;
import java.util.UUID;

import com.example.hotelbookingserver.dtos.AmenityDTO;
import com.example.hotelbookingserver.dtos.response.Response;

public interface IAmenityService {

    Response<AmenityDTO> createAmenity(String name, UUID roomTypeId);

    Response<AmenityDTO> updateAmenity(UUID id, String name);

    Response<Void> deleteAmenity(UUID id);

    Response<List<AmenityDTO>> getAmenitiesByRoomTypeId(UUID roomTypeId);
}
