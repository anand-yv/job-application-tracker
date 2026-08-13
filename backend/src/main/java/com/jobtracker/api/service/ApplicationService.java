package com.jobtracker.api.service;

import java.util.List;
import java.util.UUID;

import com.jobtracker.api.dto.JobApplicationRequest;
import com.jobtracker.api.dto.JobApplicationResponse;
import com.jobtracker.api.model.ApplicationStatus;

public interface ApplicationService {

    JobApplicationResponse createApplication(JobApplicationRequest jobApplicationRequest);

    JobApplicationResponse getApplicationById(UUID id);

    List<JobApplicationResponse> getAllApplicationsForCurrentUser();

    JobApplicationResponse updateApplication(UUID id, JobApplicationRequest jobApplicationRequest);

    JobApplicationResponse updateStatus(UUID id, ApplicationStatus applicationStatus);

    void deleteApplication(UUID id);
}
