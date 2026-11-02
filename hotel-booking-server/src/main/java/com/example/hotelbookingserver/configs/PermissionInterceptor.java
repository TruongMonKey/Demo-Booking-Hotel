package com.example.hotelbookingserver.configs;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import com.example.hotelbookingserver.entities.Permission;
import com.example.hotelbookingserver.entities.Role;
import com.example.hotelbookingserver.entities.User;
import com.example.hotelbookingserver.entities.constants.EHttpMethod;
import com.example.hotelbookingserver.entities.constants.ERole;
import com.example.hotelbookingserver.exception.PermissionException;
import com.example.hotelbookingserver.services.UserService;
import com.example.hotelbookingserver.utils.JWTUtils;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class PermissionInterceptor implements HandlerInterceptor {

    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String path = (String) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        String httpMethod = request.getMethod();

        System.out.println(">>> RUN preHandle");
        System.out.println(">>> path= " + path);
        System.out.println(">>> httpMethod= " + httpMethod);

        String email = JWTUtils.getCurrentUserLogin().orElse("");
        if (email.isEmpty()) {
            throw new PermissionException("Unauthorized: no token");
        }

        User user = this.userService.handleGetUserByUsername(email);
        if (user == null || !user.isEnabled()) {
            throw new PermissionException("Unauthorized: user not found or inactive");
        }

        Set<Role> roles = user.getRoles();
        if (roles == null || roles.isEmpty()) {
            throw new PermissionException("User has no roles assigned");
        }

        boolean isAllow = false;
        for (Role role : roles) {
            if (role.getName() == ERole.ROLE_ADMIN) {
                isAllow = true;
                break;
            }
            List<Permission> permissions = role.getPermissions();
            if (permissions != null) {
                for (Permission p : permissions) {
                    if (p.getApiPath().equals(path) && p.getMethod() == EHttpMethod.valueOf(httpMethod)) {
                        isAllow = true;
                        break;
                    }
                }
            }
            if (isAllow)
                break;
        }

        if (!isAllow) {
            throw new PermissionException("You do not have permission to access this endpoint");
        }

        return true;
    }
}
