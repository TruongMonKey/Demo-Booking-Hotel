package com.example.hotelbookingserver.services;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.hotelbookingserver.dtos.AmenityDTO;
import com.example.hotelbookingserver.dtos.Response;
import com.example.hotelbookingserver.entities.Amenity;
import com.example.hotelbookingserver.entities.RoomType;
import com.example.hotelbookingserver.repositories.AmenityRepository;
import com.example.hotelbookingserver.repositories.RoomTypeRepository;

@Service
public class AmenityService implements IAmenityService {
    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Override
    public Response createAmenity(String name, UUID roomTypeId) {
        Response response = new Response();
        try {
            RoomType roomType = roomTypeRepository.findById(roomTypeId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng"));

            Amenity amenity = new Amenity();
            amenity.setName(name);
            amenity.setRoomType(roomType);

            Amenity saved = amenityRepository.save(amenity);

            AmenityDTO dto = new AmenityDTO(saved.getId(), saved.getName(), roomTypeId);

            response.setStatusCode(HttpStatus.CREATED.value());
            response.setMessage("Tạo tiện nghi thành công");
            response.setAmenityList(List.of(dto));
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("Lỗi khi tạo tiện nghi: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateAmenity(UUID id, String name) {
        Response response = new Response();
        try {
            Amenity amenity = amenityRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tiện nghi"));

            amenity.setName(name);
            Amenity updated = amenityRepository.save(amenity);

            AmenityDTO dto = new AmenityDTO(updated.getId(), updated.getName(), updated.getRoomType().getId());

            response.setStatusCode(HttpStatus.OK.value());
            response.setMessage("Cập nhật tiện nghi thành công");
            response.setAmenityList(List.of(dto));
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.NOT_FOUND.value());
            response.setMessage("Lỗi khi cập nhật tiện nghi: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteAmenity(UUID id) {
        Response response = new Response();
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

    @Override
    public Response getAmenitiesByRoomTypeId(UUID roomTypeId) {
        Response response = new Response();
        try {
            RoomType roomType = roomTypeRepository.findById(roomTypeId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng"));

            List<AmenityDTO> dtos = amenityRepository.findByRoomType(roomType)
                    .stream()
                    .map(a -> new AmenityDTO(a.getId(), a.getName(), roomTypeId))
                    .collect(Collectors.toList());

            response.setStatusCode(HttpStatus.OK.value());
            response.setMessage("Lấy danh sách tiện nghi thành công");
            response.setAmenityList(dtos);
        } catch (Exception e) {
            response.setStatusCode(HttpStatus.BAD_REQUEST.value());
            response.setMessage("Lỗi khi lấy tiện nghi: " + e.getMessage());
        }
        return response;
    }
}
