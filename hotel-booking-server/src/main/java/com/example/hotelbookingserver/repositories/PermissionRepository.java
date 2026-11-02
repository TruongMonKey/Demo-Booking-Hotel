package com.example.hotelbookingserver.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.example.hotelbookingserver.entities.Permission;
import com.example.hotelbookingserver.entities.constants.EHttpMethod;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, UUID>, JpaSpecificationExecutor<Permission> {

    boolean existsByModuleAndApiPathAndMethod(String module, String apiPath, EHttpMethod method);

    List<Permission> findByIdIn(List<UUID> id);
}
