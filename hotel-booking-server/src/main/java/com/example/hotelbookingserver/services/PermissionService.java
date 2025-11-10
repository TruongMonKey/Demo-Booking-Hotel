package com.example.hotelbookingserver.services;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.hotelbookingserver.dtos.ResultPaginationDTO;
import com.example.hotelbookingserver.entities.Permission;
import com.example.hotelbookingserver.repositories.PermissionRepository;
import com.example.hotelbookingserver.services.impl.IPermissionService;

@Service
public class PermissionService implements IPermissionService {

    private final PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    @Override
    public boolean isPermissionExist(Permission p) {
        return permissionRepository.existsByModuleAndApiPathAndMethod(
                p.getModule(), p.getApiPath(), p.getMethod());
    }

    @Override
    public boolean isSameName(Permission p) {
        Permission permissionDB = this.fetchById(p.getId());
        return permissionDB != null && permissionDB.getName().equals(p.getName());
    }

    @Override
    public Permission fetchById(UUID id) {
        return permissionRepository.findById(id).orElse(null);
    }

    @Override
    public Permission create(Permission p) {
        return permissionRepository.save(p);
    }

    @Override
    public Permission update(Permission p) {
        Permission permissionDB = this.fetchById(p.getId());
        if (permissionDB == null)
            return null;

        permissionDB.setName(p.getName());
        permissionDB.setApiPath(p.getApiPath());
        permissionDB.setMethod(p.getMethod());
        permissionDB.setModule(p.getModule());

        return permissionRepository.save(permissionDB);
    }

    @Override
    public void delete(UUID id) {
        Optional<Permission> permissionOptional = permissionRepository.findById(id);
        Permission currentPermission = permissionOptional.orElse(null);
        if (currentPermission == null)
            return;

        currentPermission.getRoles().forEach(role -> role.getPermissions().remove(currentPermission));
        permissionRepository.delete(currentPermission);
    }

    @Override
    public ResultPaginationDTO getPermissions(Specification<Permission> spec, Pageable pageable) {
        Page<Permission> pagePermissions = permissionRepository.findAll(spec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(pagePermissions.getTotalPages());
        mt.setTotal(pagePermissions.getTotalElements());
        rs.setMeta(mt);
        rs.setResult(pagePermissions.getContent());

        return rs;
    }
}
