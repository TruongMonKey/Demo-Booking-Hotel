package com.example.hotelbookingserver.services;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.hotelbookingserver.dtos.Response;
import com.example.hotelbookingserver.dtos.UserDTO;
import com.example.hotelbookingserver.dtos.response.ResCreateUserDTO;
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

    @Override
    public User handleGetUserByUsername(String username) {
        return userRepository.findByEmail(username).orElse(null);
    }

    @Override
    public void updateUserToken(String token, String email) {
        User currentUser = this.handleGetUserByUsername(email);
        if (currentUser != null) {
            currentUser.setRefreshToken(token);
            this.userRepository.save(currentUser);
        }
    }

    @Override
    public User getUserByRefreshTokenAndEmail(String token, String email) {
        return this.userRepository.findByRefreshTokenAndEmail(token, email);
    }

    @Override
    public boolean isEmailExist(String email) {
        return this.userRepository.existsByEmail(email);
    }

    @Override
    public User handleCreateUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Role defaultRole = roleRepository.findByName(ERole.ROLE_CUSTOMER)
                    .orElseThrow(() -> new OurException("Default role not found"));
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

    public ResCreateUserDTO convertCreateUserDTO(User user) {
        ResCreateUserDTO res = new ResCreateUserDTO();
        res.setId(user.getId());
        res.setEmail(user.getEmail());
        res.setName(user.getName());
        res.setAge(user.getAge());
        res.setGender(user.getGender());
        res.setAddress(user.getAddress());
        res.setCreatedAt(user.getCreatedAt());
        return res;
    }
}
