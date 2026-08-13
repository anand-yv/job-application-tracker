package com.jobtracker.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobtracker.api.model.JobApplication;
import com.jobtracker.api.model.User;

public interface ApplicationRepository extends JpaRepository<JobApplication, UUID>{

    public List<JobApplication> findByUser(User user);

    public Optional<JobApplication> findByIdAndUser(UUID id, User user);
}
