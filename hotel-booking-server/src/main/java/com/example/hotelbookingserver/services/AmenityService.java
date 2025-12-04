package com.example.hotelbookingserver.services;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.hotelbookingserver.dtos.responses.AmenityDTO;
import com.example.hotelbookingserver.dtos.responses.Response;
import com.example.hotelbookingserver.entities.Amenity;
import com.example.hotelbookingserver.entities.RoomType;
import com.example.hotelbookingserver.exception.OurException;
import com.example.hotelbookingserver.repositories.AmenityRepository;
import com.example.hotelbookingserver.repositories.RoomTypeRepository;
import com.example.hotelbookingserver.services.impl.IAmenityService;
import com.example.hotelbookingserver.utils.Utils;

@Service
public class AmenityService implements IAmenityService {

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    // ========================= CREATE =========================
    @Override
    public Response<AmenityDTO> createAmenity(String name, UUID roomTypeId) {
        Response<AmenityDTO> response = new Response<>();
        try {
            RoomType roomType = roomTypeRepository.findById(roomTypeId)
                    .orElseThrow(() -> new OurException("Không tìm thấy loại phòng"));

            Amenity amenity = new Amenity();
            amenity.setName(name);
            amenity.setRoomType(roomType);

            Amenity saved = amenityRepository.save(amenity);

            response.setStatusCode(HttpStatus.CREATED.value());
            response.setMessage("Tạo tiện nghi thành công");
            response.setData(Utils.mapAmenityEntityToDTO(saved));

        } catch (OurException e) {
            response.setStatusCode(HttpStatus.NOT_FOUND.value());
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("Lỗi khi tạo tiện nghi: " + e.getMessage());
        }
        return response;
    }

    // ========================= UPDATE =========================
    @Override
    public Response<AmenityDTO> updateAmenity(UUID id, String name) {
        Response<AmenityDTO> response = new Response<>();
        try {
            Amenity amenity = amenityRepository.findById(id)
                    .orElseThrow(() -> new OurException("Không tìm thấy tiện nghi"));

            amenity.setName(name);
            Amenity updated = amenityRepository.save(amenity);

            response.setStatusCode(HttpStatus.OK.value());
            response.setMessage("Cập nhật tiện nghi thành công");
            response.setData(Utils.mapAmenityEntityToDTO(updated));

        } catch (OurException e) {
            response.setStatusCode(HttpStatus.NOT_FOUND.value());
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("Lỗi khi cập nhật tiện nghi: " + e.getMessage());
        }
        return response;
    }

    // ========================= DELETE =========================
    @Override
    public Response<Void> deleteAmenity(UUID id) {
        Response<Void> response = new Response<>();
        try {
            if (!amenityRepository.existsById(id)) {
                response.setStatusCode(HttpStatus.NOT_FOUND.value());
                response.setMessage("Không tìm thấy tiện nghi để xoá");
                return response;
            }

            amenityRepository.deleteById(id);

            response.setStatusCode(HttpStatus.OK.value());
            response.setMessage("Xoá tiện nghi thành công");

        } catch (Exception e) {
            response.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.setMessage("Lỗi khi xoá tiện nghi: " + e.getMessage());
        }
        return response;
    }

    // ========================= GET BY ROOM TYPE =========================
    @Override
    public Response<List<AmenityDTO>> getAmenitiesByRoomTypeId(UUID roomTypeId) {
        Response<List<AmenityDTO>> response = new Response<>();
        try {
            RoomType roomType = roomTypeRepository.findById(roomTypeId)
                    .orElseThrow(() -> new OurException("Không tìm thấy loại phòng"));

            List<AmenityDTO> dtos = amenityRepository.findByRoomType(roomType)
                    .stream()
                    .map(Utils::mapAmenityEntityToDTO)
                    .collect(Collectors.toList());

            response.setStatusCode(HttpStatus.OK.value());
            response.setMessage("Lấy danh sách tiện nghi thành công");
            response.setData(dtos);

        } catch (OurException e) {
            response.setStatusCode(HttpStatus.NOT_FOUND.value());
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("Lỗi khi lấy tiện nghi: " + e.getMessage());
        }
        return response;
    }
}
