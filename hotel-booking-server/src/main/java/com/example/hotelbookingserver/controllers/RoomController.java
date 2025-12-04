package com.example.hotelbookingserver.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.hotelbookingserver.dtos.responses.Response;
import com.example.hotelbookingserver.dtos.responses.RoomTypeResponseDTO;
import com.example.hotelbookingserver.services.impl.IBookingService;
import com.example.hotelbookingserver.services.impl.IRoomTypeService;

@RestController
@RequestMapping("/roomtypes")
@CrossOrigin
public class RoomController {

    @Autowired
    private IRoomTypeService roomService;

    @Autowired
    private IBookingService bookingService;

    // CREATE
    @PostMapping("/add")
    public ResponseEntity<Response<RoomTypeResponseDTO>> addNewRoom(@RequestBody RoomTypeResponseDTO request) {
        if (request.getName() == null || request.getName().isBlank() || request.getPrice() == null) {
            Response<RoomTypeResponseDTO> errorResponse = new Response<>();
            errorResponse.setStatusCode(400);
            errorResponse.setMessage("Please provide values for all fields (name, price)");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        Response<RoomTypeResponseDTO> response = roomService.addNewRoom(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // READ
    @GetMapping("/all")
    public ResponseEntity<Response<List<RoomTypeResponseDTO>>> getAllRooms() {
        Response<List<RoomTypeResponseDTO>> response = roomService.getAllRoomTypes();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/room-by-id/{roomId}")
    public ResponseEntity<Response<RoomTypeResponseDTO>> getRoomById(@PathVariable UUID roomId) {
        Response<RoomTypeResponseDTO> response = roomService.getRoomById(roomId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/all-available-rooms")
    public ResponseEntity<Response<List<RoomTypeResponseDTO>>> getAvailableRooms(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate) {

        Response<List<RoomTypeResponseDTO>> response = roomService.getAllAvailableRoomsByDate(checkInDate,
                checkOutDate);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/available-rooms-by-date-and-type")
    public ResponseEntity<Response<List<RoomTypeResponseDTO>>> getAvailableRoomsByDateAndType(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
            @RequestParam String roomType) {

        Response<List<RoomTypeResponseDTO>> response = roomService.getAvailableRoomsByDataAndType(checkInDate,
                checkOutDate,
                roomType);

        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // UPDATE
    @PutMapping("/update/{roomId}")
    public ResponseEntity<Response<RoomTypeResponseDTO>> updateRoom(
            @PathVariable UUID roomId,
            @RequestBody RoomTypeResponseDTO roomTypeDTO) {

        Response<RoomTypeResponseDTO> response = roomService.updateRoom(roomTypeDTO, roomId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // DELETE
    @DeleteMapping("/delete/{roomId}")
    public ResponseEntity<Response<Void>> deleteRoom(@PathVariable UUID roomId) {
        Response<Void> response = roomService.deleteRoom(roomId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
