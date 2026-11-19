package com.jobtracker.api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobtracker.api.model.ApplicationStatusHistory;

public interface ApplicationStatusHistoryRepository extends JpaRepository<ApplicationStatusHistory, UUID>{
    List<ApplicationStatusHistory> findByApplication_IdOrderByChangedAtAscIdAsc(UUID applicationId);

    void deleteByApplication_Id(UUID applicationId);
}
