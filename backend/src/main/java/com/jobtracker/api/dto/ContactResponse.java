package com.jobtracker.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ContactResponse(
    UUID id,
    String name,
    String email,
    String phone,
    String company,
    String position,
    String notes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
