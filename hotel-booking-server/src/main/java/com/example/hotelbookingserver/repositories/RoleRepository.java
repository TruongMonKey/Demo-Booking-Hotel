package com.example.hotelbookingserver.repositories;

import com.example.hotelbookingserver.entities.Role;
import com.example.hotelbookingserver.entities.constants.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(ERole name);
}
