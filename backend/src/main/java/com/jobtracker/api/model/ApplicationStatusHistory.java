package com.jobtracker.api.model;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "application_status_history",
    indexes = @Index (
        name = "idx_status_history_app_changed",
        columnList = "application_id, changed_at"
    )
)
@Getter 
@Setter 
@NoArgsConstructor 
public class ApplicationStatusHistory {
    
    @Id 
    @GeneratedValue (strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id", nullable = false)
    private JobApplication application;


    @Column(name = "old_status")
    @Enumerated (EnumType.STRING)
    private ApplicationStatus oldStatus;

    @Column (name = "new_status", nullable = false)
    @Enumerated (EnumType.STRING)
    private ApplicationStatus newStatus;

    @Column(name = "changed_at", nullable = false)
    private Instant changedAt;

    @PrePersist
    private void beforeCreate(){
        this.changedAt = Instant.now();
    }
}