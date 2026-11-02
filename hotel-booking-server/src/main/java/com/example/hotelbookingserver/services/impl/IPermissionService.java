package com.example.hotelbookingserver.services.impl;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import com.example.hotelbookingserver.dtos.PaginationResultDTO;
import com.example.hotelbookingserver.entities.Permission;

public interface IPermissionService {
    boolean isPermissionExist(Permission p);

    boolean isSameName(Permission p);

    Permission fetchById(UUID id);

    Permission create(Permission p);

    Permission update(Permission p);

    void delete(UUID id);

    PaginationResultDTO getPermissions(Specification<Permission> spec, Pageable pageable);
}
