package com.jobtracker.api.service;

import org.springframework.stereotype.Service;

import com.jobtracker.api.dto.JobApplicationRequest;
import com.jobtracker.api.dto.JobApplicationResponse;
import com.jobtracker.api.exception.DuplicateApplicationException;
import com.jobtracker.api.mapper.ApplicationMapper;
import com.jobtracker.api.model.JobApplication;
import com.jobtracker.api.model.User;
import com.jobtracker.api.repository.ApplicationRepository;
import com.jobtracker.api.security.CurrentUserProvider;

@Service
public class ApplicationServiceImpl implements ApplicationService {
    private final CurrentUserProvider currentUserProvider;
    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;

    public ApplicationServiceImpl(CurrentUserProvider currentUserProvider, ApplicationRepository applicationRepository,
            ApplicationMapper applicationMapper) {
        this.currentUserProvider = currentUserProvider;
        this.applicationRepository = applicationRepository;
        this.applicationMapper = applicationMapper;
    }

    @Override
    public JobApplicationResponse createApplication(JobApplicationRequest jobApplicationRequest) {
        User currentUser = currentUserProvider.getCurrentUser();

        if (jobApplicationRequest.jobId() != null
                && applicationRepository.existsByUserAndJobId(currentUser, jobApplicationRequest.jobId())) {
            throw new DuplicateApplicationException("You've already logged an application for this job");
        }

        JobApplication jobApplication = new JobApplication();
        jobApplication.setUser(currentUser);
        jobApplication.setCompany(jobApplicationRequest.company());
        jobApplication.setRoleTitle(jobApplicationRequest.roleTitle());
        jobApplication.setJobId(jobApplicationRequest.jobId());
        jobApplication.setJobUrl(jobApplicationRequest.jobUrl());
        if (jobApplicationRequest.status() != null) {
            jobApplication.setStatus(jobApplicationRequest.status());
        }
        jobApplication.setSource(jobApplicationRequest.source());
        jobApplication.setNotes(jobApplicationRequest.notes());
        jobApplication.setSalaryRange(jobApplicationRequest.salaryRange());
        jobApplication.setLocation(jobApplicationRequest.location());
        jobApplication.setAppliedDate(jobApplicationRequest.appliedDate());

        JobApplication savedJobApplication = applicationRepository.save(jobApplication);
        return applicationMapper.toResponse(savedJobApplication);
    }

}
