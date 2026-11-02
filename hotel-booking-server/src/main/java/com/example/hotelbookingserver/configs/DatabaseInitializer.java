package com.example.hotelbookingserver.configs;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.example.hotelbookingserver.entities.Permission;
import com.example.hotelbookingserver.entities.Role;
import com.example.hotelbookingserver.entities.User;
import com.example.hotelbookingserver.entities.constants.EGender;
import com.example.hotelbookingserver.entities.constants.ERole;
import com.example.hotelbookingserver.repositories.PermissionRepository;
import com.example.hotelbookingserver.repositories.RoleRepository;
import com.example.hotelbookingserver.repositories.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info(">>> START INIT DATABASE");
        if (permissionRepository.count() == 0) {
            List<Permission> permissions = new ArrayList<>();
            permissions.add(new Permission("Create a user", "/api/users", "POST", "USERS"));
            permissions.add(new Permission("Update a user", "/api/users", "PUT", "USERS"));
            permissions.add(new Permission("Delete a user", "/api/users/{id}", "DELETE", "USERS"));
            permissions.add(new Permission("Get a user by id", "/api/users/{id}", "GET", "USERS"));
            permissions.add(new Permission("Get users with pagination", "/api/users", "GET", "USERS"));
            // TODO: thêm các permission khác tương tự cho ROLES, HOTELS, BOOKINGS, ROOM
            // TYPES...
            permissionRepository.saveAll(permissions);
            log.info("Permissions initialized: {}", permissions.size());
        }

        // 2. Seed Roles theo ERole
        if (roleRepository.count() == 0) {
            for (ERole eRole : ERole.values()) {
                if (roleRepository.findByName(eRole).isEmpty()) {
                    Role role = new Role();
                    role.setName(eRole);
                    role.setDescription(getRoleDescription(eRole));
                    role.setActive(true);
                    // Gán tất cả permission cho ROLE_ADMIN
                    if (eRole == ERole.ROLE_ADMIN) {
                        role.setPermissions(permissionRepository.findAll());
                    }
                    roleRepository.save(role);
                    log.info("Role {} initialized", eRole);
                }
            }
        }

        // 3. Seed admin user mặc định
        if (!userRepository.existsByEmail("admin@gmail.com")) {
            User admin = new User();
            admin.setEmail("admin@gmail.com");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setName("Administrator");
            admin.setPhone("0123456789");
            admin.setGender(EGender.MALE);

            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found in database"));
            admin.setRoles(Set.of(adminRole));

            userRepository.save(admin);
            log.info("Admin account created: {}", admin.getEmail());
        }

        log.info(">>> END INIT DATABASE");
    }

    private String getRoleDescription(ERole role) {
        switch (role) {
            case ROLE_ADMIN:
                return "Administrator with full access";
            case ROLE_MANAGER:
                return "Manager with management privileges";
            case ROLE_ACCOUNTANT:
                return "Accountant with financial access";
            case ROLE_CUSTOMER:
                return "Customer user";
            default:
                return "Default role";
        }
    }
}
