package com.example.hotelbookingserver.services.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.example.hotelbookingserver.dtos.responses.Response;
import com.example.hotelbookingserver.dtos.responses.RoomTypeResponseDTO;

public interface IRoomTypeService {

        Response<RoomTypeResponseDTO> addNewRoom(RoomTypeResponseDTO dto);

        Response<List<RoomTypeResponseDTO>> getAllRoomTypes();

        Response<Void> deleteRoom(UUID roomId);

        Response<RoomTypeResponseDTO> updateRoom(RoomTypeResponseDTO dto, UUID roomId);

        Response<RoomTypeResponseDTO> getRoomById(UUID roomId);

        Response<List<RoomTypeResponseDTO>> getAvailableRoomsByDataAndType(
                        LocalDate checkInDate,
                        LocalDate checkOutDate,
                        String roomType);

        Response<List<RoomTypeResponseDTO>> getAllAvailableRoomsByDate(
                        LocalDate checkInDate,
                        LocalDate checkOutDate);
}
