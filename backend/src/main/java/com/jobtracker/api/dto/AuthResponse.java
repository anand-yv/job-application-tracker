package com.jobtracker.api.dto;

import java.time.LocalDateTime;


public class AuthResponse {
    private String email;
    private String token;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AuthResponse(String email, String token, LocalDateTime createdAt, LocalDateTime updatedAt){
        this.email = email;
        this.token = token;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getMail(){
        return email;
    };

    public String getToken(){
        return token;
    }

    public LocalDateTime getCreatedAt(){
        return createdAt;
    }

    public LocalDateTime getUpdatedAt(){
        return updatedAt;
    }
}
