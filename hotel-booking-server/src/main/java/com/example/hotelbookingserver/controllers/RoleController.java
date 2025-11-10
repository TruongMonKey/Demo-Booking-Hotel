package com.example.hotelbookingserver.controllers;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotelbookingserver.dtos.ResultPaginationDTO;
import com.example.hotelbookingserver.entities.Role;
import com.example.hotelbookingserver.exception.IdInvalidException;
import com.example.hotelbookingserver.services.RoleService;
import com.example.hotelbookingserver.utils.ApiMessage;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class RoleController {

    private RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping("/roles")
    @ApiMessage("Create a role")
    public ResponseEntity<Role> create(@Valid @RequestBody Role r) throws IdInvalidException {
        if (this.roleService.isRoleExist(r.getName())) {
            throw new IdInvalidException("Role" + r.getName() + " already exists");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(this.roleService.create(r));
    }

    @PutMapping("/roles")
    @ApiMessage("Update a role")
    public ResponseEntity<Role> update(@Valid @RequestBody Role r) throws IdInvalidException {
        if (this.roleService.fetchById(r.getId()) == null) {
            throw new IdInvalidException("Role with id: " + r.getId() + " does not exist");
        }

        return ResponseEntity.ok().body(this.roleService.update(r));
    }

    @DeleteMapping("/roles/{id}")
    @ApiMessage("Delete a role")
    public ResponseEntity<Void> delete(@PathVariable("id") UUID id) throws IdInvalidException {
        if (this.roleService.fetchById(id) == null) {
            throw new IdInvalidException("Role with id: " + id + " does not exist");
        }
        this.roleService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/roles")
    @ApiMessage("Fetch roles")
    public ResponseEntity<ResultPaginationDTO> getRoles(@Filter Specification<Role> spec,
            Pageable pageable) {
        return ResponseEntity.ok(this.roleService.getRoles(spec, pageable));
    }

    @GetMapping("/roles/{id}")
    @ApiMessage("Fetch role by id")
    public ResponseEntity<Role> getRoles(@PathVariable("id") UUID id) throws IdInvalidException {
        Role role = this.roleService.fetchById(id);
        if (role != null) {
            throw new IdInvalidException("Resume with id: " + id + " does not exist");
        }
        return ResponseEntity.ok().body(role);
    }
}
