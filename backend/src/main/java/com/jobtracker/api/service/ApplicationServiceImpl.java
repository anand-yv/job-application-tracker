package com.jobtracker.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.jobtracker.api.dto.JobApplicationRequest;
import com.jobtracker.api.dto.JobApplicationResponse;
import com.jobtracker.api.exception.ApplicationNotFoundException;
import com.jobtracker.api.mapper.ApplicationMapper;
import com.jobtracker.api.model.ApplicationStatus;
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

    @Override
    public JobApplicationResponse getApplicationById(UUID id){
        User currentUser = currentUserProvider.getCurrentUser();

        JobApplication jobApplication = applicationRepository.findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new ApplicationNotFoundException("Job application with id " + id + " not found"));

        return applicationMapper.toResponse(jobApplication);
    }

    @Override
    public List<JobApplicationResponse> getAllApplicationsForCurrentUser(){
        User currentUser = currentUserProvider.getCurrentUser();
        List<JobApplication> jobApplications = applicationRepository.findByUser(currentUser);
        return jobApplications.stream()
                .map(applicationMapper::toResponse)
                .toList();
    }

    @Override
    public JobApplicationResponse updateApplication(UUID id, JobApplicationRequest jobApplicationRequest) {
        User currentUser = currentUserProvider.getCurrentUser();

        JobApplication jobApplication = applicationRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ApplicationNotFoundException("Job application with id " + id + " not found"));

        if (jobApplicationRequest.company() != null) {
            jobApplication.setCompany(jobApplicationRequest.company());
        }
        if (jobApplicationRequest.roleTitle() != null) {
            jobApplication.setRoleTitle(jobApplicationRequest.roleTitle());
        }
        if (jobApplicationRequest.jobId() != null) {
            jobApplication.setJobId(jobApplicationRequest.jobId());
        }
        if (jobApplicationRequest.jobUrl() != null) {
            jobApplication.setJobUrl(jobApplicationRequest.jobUrl());
        }
        if (jobApplicationRequest.status() != null) {
            jobApplication.setStatus(jobApplicationRequest.status());
        }
        if (jobApplicationRequest.source() != null) {
            jobApplication.setSource(jobApplicationRequest.source());
        }
        if (jobApplicationRequest.notes() != null) {
            jobApplication.setNotes(jobApplicationRequest.notes());
        }
        if (jobApplicationRequest.salaryRange() != null) {
            jobApplication.setSalaryRange(jobApplicationRequest.salaryRange());
        }
        if (jobApplicationRequest.location() != null) {
            jobApplication.setLocation(jobApplicationRequest.location());
        }
        if (jobApplicationRequest.appliedDate() != null) {
            jobApplication.setAppliedDate(jobApplicationRequest.appliedDate());
        }

        JobApplication savedJobApplication = applicationRepository.save(jobApplication);
        return applicationMapper.toResponse(savedJobApplication);
    }

    @Override
    public JobApplicationResponse updateStatus(UUID id, ApplicationStatus applicationStatus){
        User currentUser = currentUserProvider.getCurrentUser();

        JobApplication jobApplication = applicationRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ApplicationNotFoundException("Job application with id " + id + " not found"));
        
        if (applicationStatus == null) {
            throw new IllegalArgumentException("Status cannot be null");
        }        

        jobApplication.setStatus(applicationStatus);
        JobApplication savedJobApplication = applicationRepository.save(jobApplication);
        
        return applicationMapper.toResponse(savedJobApplication);
    }

    @Override
    public void deleteApplication(UUID id){
        User currentUser = currentUserProvider.getCurrentUser();

        JobApplication jobApplication = applicationRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ApplicationNotFoundException("Job application with id " + id + " not found"));
       
        applicationRepository.delete(jobApplication);
    }

}
