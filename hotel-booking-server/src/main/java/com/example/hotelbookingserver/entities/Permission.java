package com.example.hotelbookingserver.entities;

import java.util.List;

import com.example.hotelbookingserver.entities.constants.EHttpMethod;
import com.example.hotelbookingserver.entities.mapper.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "permissions")
@Getter     
@Setter
@NoArgsConstructor
public class Permission extends BaseEntity {

    
    public Permission(String name, String apiPath, EHttpMethod method, String module) {
        this.name = name;
        this.apiPath = apiPath;
        this.method = method;
        this.module = module;
    }

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "permissions")
    @JsonIgnore
    private List<Role> roles;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "apiPath cannot be blank")
    private String apiPath;

    @NotNull(message = "Method cannot be null")
    @Enumerated(EnumType.STRING)
    private EHttpMethod method;

    @NotBlank(message = "Module cannot be blank")
    private String module;


}
