package com.jobtracker.api.dto;

import com.jobtracker.api.model.ApplicationStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateApplicationStatusRequest(
    @NotNull(message = "Status is required")
    ApplicationStatus status
) {}
