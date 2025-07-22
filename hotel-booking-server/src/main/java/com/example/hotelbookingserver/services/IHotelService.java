package com.example.hotelbookingserver.services;

import java.util.List;
import java.util.UUID;

import com.example.hotelbookingserver.dtos.HotelDTO;
import com.example.hotelbookingserver.dtos.Response;

public interface IHotelService {

    Response getAllHotels();

    Response getHotelById(UUID id);

    Response addHotel(HotelDTO requestDTO);

}
