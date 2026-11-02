package com.example.hotelbookingserver.services.impl;

import java.util.List;
import java.util.UUID;

import com.example.hotelbookingserver.dtos.responses.HotelResponseDTO;
import com.example.hotelbookingserver.dtos.responses.Response;

public interface IHotelService {

    Response<List<HotelResponseDTO>> getAllHotels();

    Response<HotelResponseDTO> getHotelById(UUID id);

    Response<HotelResponseDTO> addHotel(HotelResponseDTO requestDTO);

    Response<HotelResponseDTO> updateHotel(UUID hotelId, HotelResponseDTO requestDTO);

    Response<Void> deleteHotel(UUID hotelId);
}
