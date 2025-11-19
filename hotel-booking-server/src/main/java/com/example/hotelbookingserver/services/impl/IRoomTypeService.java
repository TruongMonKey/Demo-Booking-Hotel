package com.example.hotelbookingserver.services.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.example.hotelbookingserver.dtos.response.Response;
import com.example.hotelbookingserver.dtos.RoomTypeDTO;

public interface IRoomTypeService {

        Response<RoomTypeDTO> addNewRoom(RoomTypeDTO dto);

        Response<List<RoomTypeDTO>> getAllRoomTypes();

        Response<Void> deleteRoom(UUID roomId);

        Response<RoomTypeDTO> updateRoom(RoomTypeDTO dto, UUID roomId);

        Response<RoomTypeDTO> getRoomById(UUID roomId);

        Response<List<RoomTypeDTO>> getAvailableRoomsByDataAndType(
                        LocalDate checkInDate,
                        LocalDate checkOutDate,
                        String roomType);

        Response<List<RoomTypeDTO>> getAllAvailableRoomsByDate(
                        LocalDate checkInDate,
                        LocalDate checkOutDate);
}
