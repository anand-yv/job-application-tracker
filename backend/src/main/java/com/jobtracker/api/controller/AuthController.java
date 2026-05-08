package com.jobtracker.api.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jobtracker.api.dto.AuthResponse;
import com.jobtracker.api.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestParam String email, @RequestParam String password){
        return authService.registerUser(email, password);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestParam String email, @RequestParam String password){
        return authService.login(email, password);
    }
    
}
