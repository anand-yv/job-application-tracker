package com.jobtracker.api.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.jobtracker.api.dto.JobApplicationRequest;
import com.jobtracker.api.dto.JobApplicationResponse;
import com.jobtracker.api.dto.JobApplicationSummaryResponse;
import com.jobtracker.api.model.ApplicationStatus;

public interface ApplicationService {

    JobApplicationResponse createApplication(JobApplicationRequest jobApplicationRequest);

    JobApplicationResponse getApplicationById(UUID id);

    Page<JobApplicationSummaryResponse> getAllApplicationsForCurrentUser(ApplicationStatus status,Pageable pageable);

    JobApplicationResponse updateApplication(UUID id, JobApplicationRequest jobApplicationRequest);

    JobApplicationResponse updateStatus(UUID id, ApplicationStatus applicationStatus);

    void deleteApplication(UUID id);
}
