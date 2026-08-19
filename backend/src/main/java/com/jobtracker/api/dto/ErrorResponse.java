package com.jobtracker.api.dto;

import java.time.LocalDateTime;

public record ErrorResponse(
    LocalDateTime timestamp,
    int status,
    String reason,
    String message
) {}
