package com.example.hotelbookingserver.services.impl;

import java.util.List;
import java.util.UUID;

import com.example.hotelbookingserver.dtos.HotelDTO;
import com.example.hotelbookingserver.dtos.response.Response;

public interface IHotelService {

    Response<List<HotelDTO>> getAllHotels();

    Response<HotelDTO> getHotelById(UUID id);

    Response<HotelDTO> addHotel(HotelDTO requestDTO);

    Response<HotelDTO> updateHotel(UUID hotelId, HotelDTO requestDTO);

    Response<Void> deleteHotel(UUID hotelId);
}
