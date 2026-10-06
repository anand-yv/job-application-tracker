package com.jobtracker.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactRequest (

    @NotBlank (message = "Name is required")
    String name,

    String email,
    String phone,
    String company,
    String position,

    @Size(max = 10000, message = "Notes must be at most 10000 characters")
    String notes
){}
