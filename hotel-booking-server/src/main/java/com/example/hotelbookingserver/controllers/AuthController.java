package com.example.hotelbookingserver.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.hotelbookingserver.dtos.request.ReqLoginDTO;
import com.example.hotelbookingserver.dtos.response.ResCreateUserDTO;
import com.example.hotelbookingserver.dtos.response.ResLoginDTO;
import com.example.hotelbookingserver.entities.User;
import com.example.hotelbookingserver.exception.IdInvalidException;
import com.example.hotelbookingserver.services.UserService;
import com.example.hotelbookingserver.utils.JWTUtils;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Value("${developer.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    private final AuthenticationManager authenticationManager;
    private final JWTUtils jwtUtils;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, JWTUtils jwtUtils,
            UserService userService, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // ===================== LOGIN =====================
    @PostMapping("/login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody ReqLoginDTO loginDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User currentUser = userService.handleGetUserByUsername(loginDto.getUsername());
        ResLoginDTO res = new ResLoginDTO();
        if (currentUser != null) {
            res.setUser(userService.mapToUserLogin(currentUser));
        }

        String accessToken = jwtUtils.createAccessToken(authentication.getName(), res);
        res.setAccessToken(accessToken);

        String refreshToken = jwtUtils.createRefreshToken(loginDto.getUsername(), res);
        userService.updateUserToken(refreshToken, loginDto.getUsername());

        ResponseCookie cookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(false) // true nếu dùng https
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(res);
    }

    // ===================== GET ACCOUNT =====================
    @GetMapping("/account")
    public ResponseEntity<ResLoginDTO.UserLogin> getAccount() {
        String email = JWTUtils.getCurrentUserLogin().orElse("");
        User user = userService.handleGetUserByUsername(email);
        if (user == null)
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        return ResponseEntity.ok(userService.mapToUserLogin(user));
    }

    // ===================== REFRESH TOKEN =====================
    @GetMapping("/refresh")
    public ResponseEntity<ResLoginDTO> getRefreshToken(
            @CookieValue(name = "refresh_token", defaultValue = "abc") String refreshToken)
            throws IdInvalidException {
        if ("abc".equals(refreshToken))
            throw new IdInvalidException("Không có refresh token trong cookie");

        Jwt decoded = jwtUtils.checkValidRefreshToken(refreshToken);
        String email = decoded.getSubject();

        User currentUser = userService.getUserByRefreshTokenAndEmail(refreshToken, email);
        if (currentUser == null)
            throw new IdInvalidException("Refresh Token không hợp lệ");

        ResLoginDTO res = new ResLoginDTO();
        res.setUser(userService.mapToUserLogin(currentUser));

        String accessToken = jwtUtils.createAccessToken(email, res);
        res.setAccessToken(accessToken);

        String newRefreshToken = jwtUtils.createRefreshToken(email, res);
        userService.updateUserToken(newRefreshToken, email);

        ResponseCookie cookie = ResponseCookie.from("refresh_token", newRefreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenExpiration)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(res);
    }

    // ===================== LOGOUT =====================
    @PostMapping("/logout")
    public ResponseEntity<Void> logoutUser() throws IdInvalidException {
        String email = JWTUtils.getCurrentUserLogin().orElse("");
        if (email.isEmpty())
            throw new IdInvalidException("Access Token không hợp lệ");

        userService.updateUserToken(null, email);

        ResponseCookie deleteCookie = ResponseCookie.from("refresh_token", null)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        SecurityContextHolder.clearContext();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .build();
    }

    // ===================== REGISTER =====================
    @PostMapping("/register")
    public ResponseEntity<ResCreateUserDTO> register(@Valid @RequestBody User postUser) throws IdInvalidException {
        if (userService.isEmailExist(postUser.getEmail()))
            throw new IdInvalidException("Email " + postUser.getEmail() + " đã tồn tại");

        postUser.setPassword(passwordEncoder.encode(postUser.getPassword()));
        User newUser = userService.handleCreateUser(postUser);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.convertCreateUserDTO(newUser));
    }
}
