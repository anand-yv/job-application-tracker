package com.jobtracker.api.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User { // so every body can acces it but i have question as i think by default value is
                    // default and it can aslo be used
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id; // May be it uses some 128 bit add various bits

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = true)
    private String passwordHash; // May be its just hash

    @Column(name = "auth_provider")
    private String authProvider; // will have two values : "LOCAL" or "GOOGLE"

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // We need to find a way to automatically set the timestamp value
    // JPA Lifecycle call back
    @PrePersist
    private void beforeCreate() {
        LocalDateTime currDateTime = LocalDateTime.now();
        this.createdAt = currDateTime;
        this.updatedAt = currDateTime;
    }

    @PreUpdate
    private void beforeUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}