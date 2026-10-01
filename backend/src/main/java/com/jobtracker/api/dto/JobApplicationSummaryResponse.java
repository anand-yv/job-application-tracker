package com.jobtracker.api.dto;

import java.time.LocalDate;
import java.util.UUID;

import com.jobtracker.api.model.ApplicationStatus;

public record JobApplicationSummaryResponse(
    UUID id,
    String company,
    String roleTitle,
    ApplicationStatus status,
    LocalDate appliedDate
) {}
