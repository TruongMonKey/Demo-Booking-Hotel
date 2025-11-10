package com.example.hotelbookingserver.services.impl;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.example.hotelbookingserver.dtos.ResultPaginationDTO;
import com.example.hotelbookingserver.entities.Role;
import com.example.hotelbookingserver.entities.constants.ERole;

public interface IRoleService {

    boolean isRoleExist(ERole name);

    Role fetchById(UUID id);

    Role create(Role r);

    Role update(Role r);

    void delete(UUID id);

    ResultPaginationDTO getRoles(Specification<Role> spec, Pageable pageable);
}