package com.jobtracker.api.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.jobtracker.api.model.ApplicationStatus;

public record JobApplicationResponse (
    UUID id,
    String jobId,
    String jobUrl,
    String company,
    String roleTitle,
    ApplicationStatus status,
    String source,
    String notes,
    String salaryRange,
    String location, 
    LocalDate appliedDate,
    List<ContactResponse> contacts,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
){}
