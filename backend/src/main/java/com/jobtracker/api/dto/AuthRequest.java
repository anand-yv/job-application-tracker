package com.jobtracker.api.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthRequest(
    @NotBlank(message = "Email is required")
    String email,
    @NotBlank(message = "Password can't be empty")
    String password
) {}
