package com.jobtracker.api.dto;

import java.time.LocalDate;

import com.jobtracker.api.model.ApplicationStatus;

import jakarta.validation.constraints.NotBlank;

public record JobApplicationRequest(
    @NotBlank(message = "Company name is required")
    String company,

    @NotBlank(message= "Role title is required")
    String roleTitle,

    String jobId,
    String jobUrl,
    String source,
    String notes,
    String salaryRange,
    String location,
    ApplicationStatus applicationStatus,
    LocalDate appliedDate
) {}
