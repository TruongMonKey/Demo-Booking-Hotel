package com.example.hotelbookingserver.controllers;

import java.util.Arrays;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotelbookingserver.entities.constants.ERole;
import com.example.hotelbookingserver.utils.ApiMessage;

@RestController
@RequestMapping("/api")
public class RoleController {

    @GetMapping("/roles")
    @ApiMessage("Fetch all available roles")
    public ResponseEntity<List<ERole>> getAllRoles() {
        List<ERole> roles = Arrays.asList(ERole.values());
        return ResponseEntity.ok(roles);
    }
}
