package com.jobtracker.api.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.jobtracker.api.model.ApplicationStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JobApplicationRequest(
    @NotBlank(message = "Company name is required")
    String company,

    @NotBlank(message= "Role title is required")
    String roleTitle,

    String jobId,

    @Size(max = 2048, message = "Job URL must be at most 2048 characters")
    String jobUrl,

    String source,

    @Size(max = 10000, message = "Notes must be at most 10000 characters")
    String notes,
    String salaryRange,
    String location,
    ApplicationStatus status,
    LocalDate appliedDate,
    List<UUID> contactIds
) {}
