package com.example.hotelbookingserver.services;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.hotelbookingserver.dtos.LoginRequest;
import com.example.hotelbookingserver.dtos.Response;
import com.example.hotelbookingserver.dtos.UserDTO;
import com.example.hotelbookingserver.entities.Role;
import com.example.hotelbookingserver.entities.User;
import com.example.hotelbookingserver.entities.constants.ERole;
import com.example.hotelbookingserver.exception.OurException;
import com.example.hotelbookingserver.repositories.RoleRepository;
import com.example.hotelbookingserver.repositories.UserRepository;
import com.example.hotelbookingserver.services.impl.IUserService;
import com.example.hotelbookingserver.utils.JWTUtils;
import com.example.hotelbookingserver.utils.Utils;

@Service
public class UserService implements IUserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;
    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Response register(User user) {
        Response response = new Response();
        try {
            if (user.getRoles() == null || user.getRoles().isEmpty()) {
                Role defaultRole = roleRepository.findByName(ERole.ROLE_CUSTOMER)
                        .orElseThrow(() -> new OurException("Default role not found"));
                user.setRoles(Set.of(defaultRole));
            }
            if (userRepository.existsByEmail(user.getEmail())) {
                throw new OurException(user.getEmail() + " Already Exists");
            }
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userRepository.save(user);
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(savedUser);
            response.setStatusCode(200);
            response.setUser(userDTO);
        } catch (OurException e) {
            response.setStatusCode(400);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error Occurred During User Registration " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response login(LoginRequest loginRequest) {

        Response response = new Response();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            var user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new OurException("user Not found"));

            var userDetails = customUserDetailsService.loadUserByUsername(loginRequest.getEmail());
            var token = jwtUtils.generateToken(userDetails);
            response.setStatusCode(200);
            response.setToken(token);
            response.setRoles(
                    user.getRoles().stream()
                            .map(role -> role.getName().name())
                            .collect(Collectors.toList()));
            response.setExpirationTime("7 Days");
            response.setMessage("successful");
            response.setFullName(user.getName());
            response.setEmail(user.getEmail());
            response.setPhone(user.getPhone());

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error Occurred During USer Login " + e.getMessage());
        }
        return response;
    }

    public Response getAllUsers() {
        Response response = new Response();
        try {
            List<User> userList = userRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));

            List<UserDTO> userDTOList = userList.stream()
                    .map(Utils::mapUserEntityToUserDTOPlusUserBookingsAndRoom)
                    .collect(Collectors.toList());

            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUserList(userDTOList);
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching users: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getUserBookingHistory(UUID userId) {

        Response response = new Response();

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new OurException("User not found with ID: " + userId));
            UserDTO userDTO = Utils.mapUserEntityToUserDTOPlusUserBookingsAndRoom(user);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDTO);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response deleteUser(UUID userId) {

        Response response = new Response();

        try {
            userRepository.findById(userId).orElseThrow(() -> new OurException("User Not Found"));
            userRepository.deleteById(userId);
            response.setStatusCode(200);
            response.setMessage("successful");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getUserById(UUID userId) {

        Response response = new Response();

        try {
            User user = userRepository.findById(userId).orElseThrow(() -> new OurException("User Not Found"));
            UserDTO userDTO = Utils.mapUserEntityToUserDTOPlusUserBookingsAndRoom(user);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDTO);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response updateUserById(UUID userId, UserDTO dto) {
        Response response = new Response();
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new OurException("User Not Found"));

            // Cập nhật roles
            Set<Role> newRoles = dto.getRoles().stream()
                    .map(roleStr -> roleRepository.findByName(ERole.valueOf(roleStr))
                            .orElseThrow(() -> new OurException("Role not found: " + roleStr)))
                    .collect(Collectors.toSet());
            user.setRoles(newRoles);

            userRepository.save(user);

            response.setStatusCode(200);
            response.setMessage("User roles updated successfully");

        } catch (IllegalArgumentException e) {
            response.setStatusCode(400);
            response.setMessage("Invalid role value: " + dto.getRoles());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Update failed: " + e.getMessage());
        }
        return response;
    }

    @Override
    public Response getMyInfo(String email) {

        Response response = new Response();

        try {
            User user = userRepository.findByEmail(email).orElseThrow(() -> new OurException("User Not Found"));
            UserDTO userDTO = Utils.mapUserEntityToUserDTO(user);
            response.setStatusCode(200);
            response.setMessage("successful");
            response.setUser(userDTO);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {

            response.setStatusCode(500);
            response.setMessage("Error getting all users " + e.getMessage());
        }
        return response;
    }
}
