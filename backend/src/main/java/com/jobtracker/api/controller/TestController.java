package com.jobtracker.api.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jobtracker.api.security.JwtUtil;

@RestController
@RequestMapping("/test")
public class TestController {
    private JwtUtil jwtUtil;

    TestController(JwtUtil jwtUtil){
        this.jwtUtil = jwtUtil;
    }

    @PostMapping(path = "/generate-token")
    public String generateToken(@RequestParam String email){
        return jwtUtil.generateToken(email);
    }

    @PostMapping(path = "/validate-token")
    public String validateToken(@RequestParam String token){
        return jwtUtil.extractEmail(token);
    }
}
