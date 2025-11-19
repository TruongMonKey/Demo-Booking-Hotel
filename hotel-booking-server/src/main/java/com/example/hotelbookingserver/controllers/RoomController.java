package com.example.hotelbookingserver.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.hotelbookingserver.dtos.RoomTypeDTO;
import com.example.hotelbookingserver.dtos.response.Response;
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
    public ResponseEntity<Response<RoomTypeDTO>> addNewRoom(@RequestBody RoomTypeDTO request) {
        if (request.getName() == null || request.getName().isBlank() || request.getPrice() == null) {
            Response<RoomTypeDTO> errorResponse = new Response<>();
            errorResponse.setStatusCode(400);
            errorResponse.setMessage("Please provide values for all fields (name, price)");
            return ResponseEntity.badRequest().body(errorResponse);
        }
        Response<RoomTypeDTO> response = roomService.addNewRoom(request);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // READ
    @GetMapping("/all")
    public ResponseEntity<Response<List<RoomTypeDTO>>> getAllRooms() {
        Response<List<RoomTypeDTO>> response = roomService.getAllRoomTypes();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/room-by-id/{roomId}")
    public ResponseEntity<Response<RoomTypeDTO>> getRoomById(@PathVariable UUID roomId) {
        Response<RoomTypeDTO> response = roomService.getRoomById(roomId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/all-available-rooms")
    public ResponseEntity<Response<List<RoomTypeDTO>>> getAvailableRooms(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate) {

        Response<List<RoomTypeDTO>> response = roomService.getAllAvailableRoomsByDate(checkInDate, checkOutDate);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/available-rooms-by-date-and-type")
    public ResponseEntity<Response<List<RoomTypeDTO>>> getAvailableRoomsByDateAndType(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
            @RequestParam String roomType) {

        Response<List<RoomTypeDTO>> response = roomService.getAvailableRoomsByDataAndType(checkInDate, checkOutDate,
                roomType);

        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // UPDATE
    @PutMapping("/update/{roomId}")
    public ResponseEntity<Response<RoomTypeDTO>> updateRoom(
            @PathVariable UUID roomId,
            @RequestBody RoomTypeDTO roomTypeDTO) {

        Response<RoomTypeDTO> response = roomService.updateRoom(roomTypeDTO, roomId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // DELETE
    @DeleteMapping("/delete/{roomId}")
    public ResponseEntity<Response<Void>> deleteRoom(@PathVariable UUID roomId) {
        Response<Void> response = roomService.deleteRoom(roomId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
