package com.jobtracker.api.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.jobtracker.api.dto.AuthRequest;
import com.jobtracker.api.dto.AuthResponse;
import com.jobtracker.api.exception.EmailAlreadyExistsException;
import com.jobtracker.api.exception.InvalidCredentialsException;
import com.jobtracker.api.model.User;
import com.jobtracker.api.repository.UserRepository;
import com.jobtracker.api.security.CurrentUserProvider;
import com.jobtracker.api.security.JwtUtil;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final CurrentUserProvider currentUserProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, CurrentUserProvider currentUserProvider){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.currentUserProvider = currentUserProvider;
    }

    public AuthResponse registerUser(AuthRequest authRequest){
        // 1. Check if email already exists
        Optional<User> existingEmail = userRepository.findByEmail(authRequest.email());
        if (existingEmail.isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists with that email");         // return ;
        }

        // 2. Create new User object
        User user = new User();
        // 3. Hash the password
        String passwordHash = passwordEncoder.encode(authRequest.password());
        user.setEmail(authRequest.email());
        user.setPasswordHash(passwordHash);
        user.setAuthProvider("LOCAL");
        // 4. Save user to database
        userRepository.save(user);
        // 5. Generate JWT token
        String token = jwtUtil.generateToken(authRequest.email());
        // 6. Return AuthResponse
        return new AuthResponse(authRequest.email(), token, user.getCreatedAt(), user.getUpdatedAt());
    }

    public AuthResponse login(AuthRequest authRequest){
        User user = userRepository.findByEmail(authRequest.email()).orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));
        if(!passwordEncoder.matches(authRequest.password(), user.getPasswordHash())){
            throw new InvalidCredentialsException("Invalid email or password");
        }
        String token = jwtUtil.generateToken(authRequest.email());
        return new AuthResponse(authRequest.email(), token, user.getCreatedAt(), user.getUpdatedAt());
    }

    public AuthResponse getCurrentUser(){
        User user = currentUserProvider.getCurrentUser();
        return new AuthResponse(user.getEmail(), null, user.getCreatedAt(), user.getUpdatedAt());
    }
}
