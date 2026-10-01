package com.jobtracker.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.jobtracker.api.model.JobApplication;
import com.jobtracker.api.model.User;

public interface ApplicationRepository extends JpaRepository<JobApplication, UUID>, JpaSpecificationExecutor<JobApplication>{

    List<JobApplication> findByUser(User user);

    Optional<JobApplication> findByIdAndUser(UUID id, User user);
}
