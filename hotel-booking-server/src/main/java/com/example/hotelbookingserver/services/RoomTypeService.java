package com.example.hotelbookingserver.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.hotelbookingserver.dtos.AmenityDTO;
import com.example.hotelbookingserver.dtos.Response;
import com.example.hotelbookingserver.dtos.RoomTypeDTO;
import com.example.hotelbookingserver.entities.Amenity;
import com.example.hotelbookingserver.entities.Hotel;
import com.example.hotelbookingserver.entities.Image;
import com.example.hotelbookingserver.entities.RoomType;
import com.example.hotelbookingserver.exception.OurException;
import com.example.hotelbookingserver.repositories.AmenityRepository;
import com.example.hotelbookingserver.repositories.HotelRepository;
import com.example.hotelbookingserver.repositories.ImageRepository;
import com.example.hotelbookingserver.repositories.RoomTypeRepository;
import com.example.hotelbookingserver.utils.Utils;

@Service
public class RoomTypeService implements IRoomTypeService {
    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Override
    public Response addNewRoom(RoomTypeDTO dto) {
        Response response = new Response();

        try {
            Optional<Hotel> optionalHotel = hotelRepository.findById(dto.getHotelId());
            if (!optionalHotel.isPresent()) {
                response.setStatusCode(404);
                response.setMessage("Hotel with ID " + dto.getHotelId() + " not found.");
                return response;
            }

            Hotel hotel = optionalHotel.get();

            RoomType roomType = new RoomType();
            roomType.setName(dto.getName());
            roomType.setQuantityBed(dto.getQuantityBed());
            roomType.setQuantityPeople(dto.getQuantityPeople());
            roomType.setRoomArea(dto.getRoomArea());
            roomType.setPrice(dto.getPrice());
            roomType.setQuantityRoom(dto.getQuantityRoom());
            roomType.setHotel(hotel);

            RoomType savedRoomType = roomTypeRepository.save(roomType);

            if (dto.getAmenities() != null) {
                for (AmenityDTO amenityDTO : dto.getAmenities()) {
                    Amenity amenity = new Amenity();
                    amenity.setName(amenityDTO.getName());
                    amenity.setRoomType(savedRoomType);
                    amenityRepository.save(amenity);
                }
            }

            if (dto.getImageFiles() != null && !dto.getImageFiles().isEmpty()) {
                for (String url : dto.getImageFiles()) {
                    Image image = new Image();
                    image.setRoomType(savedRoomType);
                    image.setImageUrl(url);
                    imageRepository.save(image);
                }
            }

            RoomTypeDTO responseDTO = Utils.mapRoomEntityToRoomDTO(savedRoomType);
            response.setStatusCode(201);
            response.setMessage("Room added successfully");
            response.setRoom(responseDTO);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error adding room: " + e.getMessage());
        }

        return response;
    }

    @Override
    public Response getAllRoomTypes() {
        Response response = new Response();

        try {
            List<RoomType> roomList = roomTypeRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
            List<RoomTypeDTO> roomDTOList = Utils.mapRoomListEntityToRoomListDTO(roomList);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setRoomList(roomDTOList);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error saving a room " + e.getMessage());
        }
        return response;
    }

    @Override
    public List<String> getAllRoomTypeNames() {
        return roomTypeRepository.findDistinctRoomTypeNames();
    }

    @Override
    public Response deleteRoom(UUID roomId) {
        Response response = new Response();

        try {
            roomTypeRepository.findById(roomId).orElseThrow(() -> new OurException("Room Not Found"));
            roomTypeRepository.deleteById(roomId);
            response.setStatusCode(200);
            response.setMessage("successful");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error saving a room " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getRoomById(UUID roomId) {
        Response response = new Response();

        try {
            RoomType room = roomTypeRepository.findById(roomId).orElseThrow(() -> new OurException("Room Not Found"));
            RoomTypeDTO roomDTO = Utils.mapRoomEntityToRoomDTOPlusBookings(room);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setRoom(roomDTO);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error saving a room " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAvailableRoomsByDataAndType(LocalDate checkInDate, LocalDate checkOutDate, String roomType) {
        Response response = new Response();

        try {
            List<RoomType> availableRooms = roomTypeRepository.findAvailableRoomsByDatesAndTypes(checkInDate,
                    checkOutDate, roomType);
            List<RoomTypeDTO> roomDTOList = Utils.mapRoomListEntityToRoomListDTO(availableRooms);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setRoomList(roomDTOList);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error saving a room " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getAllAvailableRoomsByDate(LocalDate checkInDate, LocalDate checkOutDate) {
        Response response = new Response();

        try {
            List<RoomType> roomList = roomTypeRepository.getAllAvailableRoomsByDate(checkInDate, checkOutDate);
            List<RoomTypeDTO> roomDTOList = Utils.mapRoomListEntityToRoomListDTO(roomList);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setRoomList(roomDTOList);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error saving a room " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateRoom(RoomTypeDTO dto, UUID roomId) {
        Response response = new Response();

        try {
            RoomType room = roomTypeRepository.findById(roomId)
                    .orElseThrow(() -> new OurException("Room Not Found"));

            // Cập nhật các trường cơ bản
            if (dto.getName() != null)
                room.setName(dto.getName());
            room.setQuantityBed(dto.getQuantityBed());
            room.setQuantityPeople(dto.getQuantityPeople());
            room.setRoomArea(dto.getRoomArea());
            room.setPrice(dto.getPrice());
            room.setQuantityRoom(dto.getQuantityRoom());

            RoomType updatedRoom = roomTypeRepository.save(room);

            if (dto.getImageFiles() != null && !dto.getImageFiles().isEmpty()) {
                for (String url : dto.getImageFiles()) {
                    Image image = new Image();
                    image.setRoomType(updatedRoom);
                    image.setImageUrl(url);
                    imageRepository.save(image);
                }
            }

            RoomTypeDTO roomDTO = Utils.mapRoomEntityToRoomDTO(updatedRoom);
            response.setStatusCode(200);
            response.setMessage("Cập nhật phòng thành công.");
            response.setRoom(roomDTO);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Lỗi khi cập nhậtphòng: " + e.getMessage());
        }

        return response;
    }
}
