package com.example.hotelbookingserver.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.hotelbookingserver.dtos.ResultPaginationDTO;
import com.example.hotelbookingserver.entities.Permission;
import com.example.hotelbookingserver.entities.Role;
import com.example.hotelbookingserver.entities.constants.ERole;
import com.example.hotelbookingserver.repositories.PermissionRepository;
import com.example.hotelbookingserver.repositories.RoleRepository;
import com.example.hotelbookingserver.services.impl.IRoleService;

@Service
public class RoleService implements IRoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public RoleService(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    public boolean isRoleExist(ERole name) {
        return roleRepository.existsByName(name);
    }

    @Override
    public Role fetchById(UUID id) {
        Optional<Role> roleOptional = roleRepository.findById(id);
        return roleOptional.orElse(null);
    }

    @Override
    public Role create(Role r) {
        if (r.getPermissions() != null) {
            List<UUID> reqPermissions = r.getPermissions()
                    .stream()
                    .map(Permission::getId)
                    .collect(Collectors.toList());

            List<Permission> dbPermissions = permissionRepository.findByIdIn(reqPermissions);
            r.setPermissions(dbPermissions);
        }

        return roleRepository.save(r);
    }

    @Override
    public Role update(Role r) {
        Role roleDB = this.fetchById(r.getId());
        if (roleDB == null) {
            return null;
        }

        if (r.getPermissions() != null) {
            List<UUID> reqPermissions = r.getPermissions()
                    .stream()
                    .map(Permission::getId)
                    .collect(Collectors.toList());

            List<Permission> dbPermissions = permissionRepository.findByIdIn(reqPermissions);
            roleDB.setPermissions(dbPermissions);
        }

        roleDB.setName(r.getName());
        roleDB.setDescription(r.getDescription());
        roleDB.setActive(r.isActive());

        return roleRepository.save(roleDB);
    }

    @Override
    public void delete(UUID id) {
        roleRepository.deleteById(id);
    }

    @Override
    public ResultPaginationDTO getRoles(Specification<Role> spec, Pageable pageable) {
        Page<Role> pageRoles = roleRepository.findAll(spec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        ResultPaginationDTO.Meta mt = new ResultPaginationDTO.Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(pageRoles.getTotalPages());
        mt.setTotal(pageRoles.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(pageRoles.getContent());

        return rs;
    }

}
