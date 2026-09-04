package com.jobtracker.api.dto;

import jakarta.validation.constraints.NotBlank;

public record ContactRequest (

    @NotBlank (message = "Name is required")
    String name,

    String email,
    String phone,
    String company,
    String position,
    String notes
){}
