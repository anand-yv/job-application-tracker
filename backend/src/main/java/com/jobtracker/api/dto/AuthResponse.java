package com.jobtracker.api.dto;
import java.time.LocalDateTime;

public record AuthResponse(
    String email,
    String token,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
){}