package com.jobtracker.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobtracker.api.dto.AuthRequest;
import com.jobtracker.api.dto.AuthResponse;
import com.jobtracker.api.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody AuthRequest authRequest){
        return authService.registerUser(authRequest);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest authRequest){
        return authService.login(authRequest);
    }
    
    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(){
        return ResponseEntity.ok(authService.getCurrentUser());
    }
}
