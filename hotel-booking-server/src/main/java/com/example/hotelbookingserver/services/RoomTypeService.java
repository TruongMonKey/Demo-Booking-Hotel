package com.example.hotelbookingserver.services;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.hotelbookingserver.dtos.responses.Response;
import com.example.hotelbookingserver.dtos.responses.RoomTypeResponseDTO;
import com.example.hotelbookingserver.entities.Amenity;
import com.example.hotelbookingserver.entities.Hotel;
import com.example.hotelbookingserver.entities.Image;
import com.example.hotelbookingserver.entities.RoomType;
import com.example.hotelbookingserver.exception.OurException;
import com.example.hotelbookingserver.repositories.AmenityRepository;
import com.example.hotelbookingserver.repositories.HotelRepository;
import com.example.hotelbookingserver.repositories.ImageRepository;
import com.example.hotelbookingserver.repositories.RoomTypeRepository;
import com.example.hotelbookingserver.services.impl.IRoomTypeService;
import com.example.hotelbookingserver.utils.Utils;

import jakarta.transaction.Transactional;

@Service
@Transactional
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
    public Response<RoomTypeResponseDTO> addNewRoom(RoomTypeResponseDTO dto) {
        Response<RoomTypeResponseDTO> res = new Response<>();
        try {

            Hotel hotel = hotelRepository.findById(dto.getHotelId())
                    .orElseThrow(() -> new OurException("Hotel not found"));

            RoomType room = new RoomType();
            room.setName(dto.getName());
            room.setQuantityBed(dto.getQuantityBed());
            room.setQuantityPeople(dto.getQuantityPeople());
            room.setRoomArea(dto.getRoomArea());
            room.setPrice(dto.getPrice());
            room.setQuantityRoom(dto.getQuantityRoom());
            room.setHotel(hotel);

            RoomType saved = roomTypeRepository.save(room);

            // ===== AMENITIES =====
            if (dto.getAmenities() != null) {
                for (var a : dto.getAmenities()) {
                    Amenity amenity = new Amenity();
                    amenity.setName(a.getName());
                    amenity.setRoomType(saved);
                    amenityRepository.save(amenity);
                }
            }

            // ===== IMAGES =====
            if (dto.getImageFiles() != null) {
                for (String url : dto.getImageFiles()) {
                    Image img = new Image();
                    img.setImageUrl(url);
                    img.setRoomType(saved);
                    imageRepository.save(img);
                }
            }

            RoomTypeResponseDTO result = Utils.mapRoomEntityToRoomDTO(saved);

            res.setStatusCode(201);
            res.setMessage("Room created successfully");
            res.setData(result);

        } catch (Exception e) {
            res.setStatusCode(500);
            res.setMessage(e.getMessage());
        }
        return res;
    }

    @Override
    public Response<List<RoomTypeResponseDTO>> getAllRoomTypes() {
        Response<List<RoomTypeResponseDTO>> res = new Response<>();
        try {
            List<RoomType> rooms = roomTypeRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
            res.setStatusCode(200);
            res.setMessage("Success");
            res.setData(Utils.mapRoomListEntityToRoomListDTO(rooms));
        } catch (Exception ex) {
            res.setStatusCode(500);
            res.setMessage(ex.getMessage());
        }
        return res;
    }

    @Override
    public Response<RoomTypeResponseDTO> getRoomById(UUID roomId) {
        Response<RoomTypeResponseDTO> res = new Response<>();
        try {
            RoomType room = roomTypeRepository.findById(roomId)
                    .orElseThrow(() -> new OurException("Room not found"));

            res.setStatusCode(200);
            res.setMessage("Success");
            res.setData(Utils.mapRoomEntityToRoomDTOPlusBookings(room));

        } catch (OurException e) {
            res.setStatusCode(404);
            res.setMessage(e.getMessage());
        }
        return res;
    }

    @Override
    public Response<Void> deleteRoom(UUID roomId) {
        Response<Void> res = new Response<>();
        try {
            RoomType room = roomTypeRepository.findById(roomId)
                    .orElseThrow(() -> new OurException("Room not found"));

            // Xoá ảnh + amenity
            imageRepository.deleteByRoomType(room);
            amenityRepository.deleteByRoomType(room);

            roomTypeRepository.delete(room);

            res.setStatusCode(200);
            res.setMessage("Deleted successfully");

        } catch (OurException e) {
            res.setStatusCode(404);
            res.setMessage(e.getMessage());
        }
        return res;
    }

    @Override
    public Response<List<RoomTypeResponseDTO>> getAllAvailableRoomsByDate(LocalDate checkIn, LocalDate checkOut) {
        Response<List<RoomTypeResponseDTO>> res = new Response<>();
        try {
            List<RoomType> rooms = roomTypeRepository.getAllAvailableRoomsByDate(checkIn, checkOut);
            res.setStatusCode(200);
            res.setMessage("Success");
            res.setData(Utils.mapRoomListEntityToRoomListDTO(rooms));
        } catch (Exception e) {
            res.setStatusCode(500);
            res.setMessage(e.getMessage());
        }
        return res;
    }

    @Override
    public Response<RoomTypeResponseDTO> updateRoom(RoomTypeResponseDTO dto, UUID roomId) {
        Response<RoomTypeResponseDTO> res = new Response<>();
        try {

            RoomType room = roomTypeRepository.findById(roomId)
                    .orElseThrow(() -> new OurException("Room not found"));

            // update basic fields
            if (dto.getName() != null)
                room.setName(dto.getName());
            if (dto.getQuantityBed() != null)
                room.setQuantityBed(dto.getQuantityBed());
            if (dto.getQuantityPeople() != null)
                room.setQuantityPeople(dto.getQuantityPeople());
            if (dto.getRoomArea() != null)
                room.setRoomArea(dto.getRoomArea());
            if (dto.getPrice() != null)
                room.setPrice(dto.getPrice());
            if (dto.getQuantityRoom() != null)
                room.setQuantityRoom(dto.getQuantityRoom());

            RoomType updated = roomTypeRepository.save(room);

            // =========== UPDATE IMAGES ===========
            if (dto.getImageFiles() != null) {
                imageRepository.deleteByRoomType(updated);
                for (String url : dto.getImageFiles()) {
                    Image img = new Image();
                    img.setRoomType(updated);
                    img.setImageUrl(url);
                    imageRepository.save(img);
                }
            }

            // =========== UPDATE AMENITIES ===========
            if (dto.getAmenities() != null) {
                amenityRepository.deleteByRoomType(updated);
                for (var a : dto.getAmenities()) {
                    Amenity am = new Amenity();
                    am.setRoomType(updated);
                    am.setName(a.getName());
                    amenityRepository.save(am);
                }
            }

            res.setStatusCode(200);
            res.setMessage("Updated successfully");
            res.setData(Utils.mapRoomEntityToRoomDTO(updated));

        } catch (OurException e) {
            res.setStatusCode(404);
            res.setMessage(e.getMessage());
        }
        return res;
    }

    @Override
    public Response<List<RoomTypeResponseDTO>> getAvailableRoomsByDataAndType(LocalDate checkInDate,
            LocalDate checkOutDate,
            String roomType) {
        Response<List<RoomTypeResponseDTO>> res = new Response<>();
        try {
            List<RoomType> rooms = roomTypeRepository.findAvailableRoomsByDatesAndTypes(checkInDate, checkOutDate,
                    roomType);
            res.setStatusCode(200);
            res.setMessage("Success");
            res.setData(Utils.mapRoomListEntityToRoomListDTO(rooms));
        } catch (Exception e) {
            res.setStatusCode(500);
            res.setMessage(e.getMessage());
        }
        return res;
    }

}
