package com.example.hotelbookingserver.configs;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.hotelbookingserver.entities.Role;
import com.example.hotelbookingserver.entities.User;
import com.example.hotelbookingserver.entities.constants.ERole;
import com.example.hotelbookingserver.repositories.RoleRepository;
import com.example.hotelbookingserver.repositories.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class AdminInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            // Khởi tạo tất cả roles nếu chưa tồn tại
            initializeRoles();

            if (!userRepository.existsByEmail("admin@gmail.com")) {
                User admin = new User();
                admin.setEmail("admin@gmail.com");
                admin.setPassword(passwordEncoder.encode("123456"));
                admin.setName("Administrator");
                admin.setPhone("0123456789");

                Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found in database"));
                admin.setRoles(Set.of(adminRole));

                userRepository.save(admin);
                log.info("Admin account created successfully!");
            }
        } catch (Exception e) {
            log.error("Error creating admin account: {}", e.getMessage());
        }
    }

    private void initializeRoles() {
        for (ERole eRole : ERole.values()) {
            if (!roleRepository.findByName(eRole).isPresent()) {
                Role role = new Role();
                role.setName(eRole);
                role.setDescription(getRoleDescription(eRole));
                role.setActive(true);
                roleRepository.save(role);
                log.info("Role {} initialized successfully", eRole);
            }
        }
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