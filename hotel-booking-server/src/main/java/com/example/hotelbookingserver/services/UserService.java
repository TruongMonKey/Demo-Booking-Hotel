package com.example.hotelbookingserver.services;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.hotelbookingserver.dtos.requests.BookingCreateRequest;
import com.example.hotelbookingserver.dtos.requests.UserCreateRequest;
import com.example.hotelbookingserver.dtos.responses.ResLoginDTO;
import com.example.hotelbookingserver.dtos.responses.Response;
import com.example.hotelbookingserver.dtos.responses.UserResponseDTO;
import com.example.hotelbookingserver.entities.Role;
import com.example.hotelbookingserver.entities.User;
import com.example.hotelbookingserver.entities.constants.ERole;
import com.example.hotelbookingserver.exception.OurException;
import com.example.hotelbookingserver.repositories.RoleRepository;
import com.example.hotelbookingserver.repositories.UserRepository;
import com.example.hotelbookingserver.services.impl.IUserService;
import com.example.hotelbookingserver.utils.Utils;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    // ==========================================================
    // 1. GET ALL USERS
    // ==========================================================

    @Override
    public Response<List<UserResponseDTO>> getAllUsers() {
        Response<List<UserResponseDTO>> response = new Response<>();
        try {
            List<UserResponseDTO> data = userRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
                    .stream()
                    .map(Utils::mapUserEntityToUserDTOPlusUserBookingsAndRoom)
                    .collect(Collectors.toList());

            response.setStatusCode(200);
            response.setMessage("successful");
            response.setData(data);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching users: " + e.getMessage());
        }
        return response;
    }

    // ==========================================================
    // 2. GET USER BOOKING HISTORY
    // ==========================================================

    @Override
    public Response<List<BookingCreateRequest>> getUserBookingHistory(UUID userId) {
        Response<List<BookingCreateRequest>> response = new Response<>();
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new OurException("User not found"));

            List<BookingCreateRequest> bookings = Utils.mapBookingListEntityToBookingListDTO(user.getBookings(), true,
                    true,
                    true);

            response.setStatusCode(200);
            response.setMessage("successful");
            response.setData(bookings);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error getting booking history: " + e.getMessage());
        }

        return response;
    }

    // ==========================================================
    // 3. DELETE USER
    // ==========================================================

    @Override
    public Response<String> deleteUser(UUID userId) {
        Response<String> response = new Response<>();
        try {
            userRepository.findById(userId)
                    .orElseThrow(() -> new OurException("User not found"));

            userRepository.deleteById(userId);

            response.setStatusCode(200);
            response.setMessage("User deleted successfully");
            response.setData("deleted");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error deleting user: " + e.getMessage());
        }
        return response;
    }

    // ==========================================================
    // 4. GET USER BY ID
    // ==========================================================

    @Override
    public Response<UserResponseDTO> getUserById(UUID userId) {
        Response<UserResponseDTO> response = new Response<>();
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new OurException("User Not Found"));

            UserResponseDTO dto = Utils.mapUserEntityToUserDTOPlusUserBookingsAndRoom(user);

            response.setStatusCode(200);
            response.setMessage("successful");
            response.setData(dto);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error getting user: " + e.getMessage());
        }
        return response;
    }

    // ==========================================================
    // 5. UPDATE USER
    // ==========================================================

    @Override
    public Response<UserResponseDTO> updateUserById(UUID userId, UserResponseDTO dto) {
        Response<UserResponseDTO> response = new Response<>();
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new OurException("User Not Found"));

            // Update basic fields if provided
            if (dto.getName() != null) {
                user.setName(dto.getName());
            }
            if (dto.getEmail() != null) {
                user.setEmail(dto.getEmail());
            }
            if (dto.getAge() != null) {
                user.setAge(dto.getAge());
            }

            userRepository.save(user);

            UserResponseDTO updated = Utils.mapUserEntityToUserDTOPlusUserBookingsAndRoom(user);

            response.setStatusCode(200);
            response.setMessage("Update successful");
            response.setData(updated);

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage("Error: " + e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Update failed: " + e.getMessage());
        }

        return response;
    }

    // ==========================================================
    // 6. GET LOGGED-IN USER INFO
    // ==========================================================

    @Override
    public Response<UserResponseDTO> getMyInfo(String email) {
        Response<UserResponseDTO> response = new Response<>();
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new OurException("User Not Found"));

            UserResponseDTO dto = Utils.mapUserEntityToUserDTO(user);

            response.setStatusCode(200);
            response.setMessage("successful");
            response.setData(dto);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error: " + e.getMessage());
        }
        return response;
    }

    // ==========================================================
    // AUTH HELPER METHODS
    // ==========================================================

    @Override
    public User handleGetUserByUsername(String username) {
        return userRepository.findByEmail(username).orElse(null);
    }

    @Override
    public void updateUserToken(String token, String email) {
        User currentUser = handleGetUserByUsername(email);
        if (currentUser != null) {
            currentUser.setRefreshToken(token);
            userRepository.save(currentUser);
        }
    }

    @Override
    public User getUserByRefreshTokenAndEmail(String token, String email) {
        return userRepository.findByRefreshTokenAndEmail(token, email);
    }

    @Override
    public boolean isEmailExist(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public User handleCreateUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Role defaultRole = roleRepository.findByName(ERole.ROLE_CUSTOMER)
                    .orElseThrow(() -> new OurException("Default role missing"));
            user.setRoles(Set.of(defaultRole));
        } else {
            Set<Role> roles = user.getRoles().stream()
                    .map(role -> roleRepository.findByName(role.getName())
                            .orElseThrow(() -> new OurException("Role not found: " + role.getName())))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        return userRepository.save(user);
    }

    public UserCreateRequest convertCreateUserDTO(User user) {
        UserCreateRequest res = new UserCreateRequest();
        res.setEmail(user.getEmail());
        res.setName(user.getName());
        res.setPassword(user.getPassword()); // Not recommended in production
        res.setAge(user.getAge());
        return res;
    }

    @Override
    public Response<UserResponseDTO> createUser(UserCreateRequest dto) {
        Response<UserResponseDTO> response = new Response<>();
        try {
            // Check if user already exists
            if (isEmailExist(dto.getEmail())) {
                response.setStatusCode(400);
                response.setMessage("Email already exists");
                return response;
            }

            // Create new user
            User user = new User();
            user.setEmail(dto.getEmail());
            user.setName(dto.getName());
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
            if (dto.getAge() != null) {
                user.setAge(dto.getAge());
            }

            // Set default role as ROLE_CUSTOMER
            Role customerRole = roleRepository.findByName(ERole.ROLE_CUSTOMER)
                    .orElseThrow(() -> new OurException("Default role not found"));
            user.setRoles(Set.of(customerRole));

            User savedUser = userRepository.save(user);

            UserResponseDTO created = Utils.mapUserEntityToUserDTO(savedUser);

            response.setStatusCode(201);
            response.setMessage("User created successfully");
            response.setData(created);

        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage("Error: " + e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error creating user: " + e.getMessage());
        }

        return response;
    }

    public ResLoginDTO.UserLogin mapToUserLogin(User user) {
        List<String> roles = user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());

        List<String> permissions = user.getRoles().stream()
                .flatMap(r -> r.getPermissions().stream())
                .map(p -> p.getName())
                .collect(Collectors.toList());

        return new ResLoginDTO.UserLogin(
                user.getId(),
                user.getEmail(),
                user.getName(),
                roles,
                permissions);
    }

}
