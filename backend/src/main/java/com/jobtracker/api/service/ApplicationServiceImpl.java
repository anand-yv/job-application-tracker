package com.jobtracker.api.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.jobtracker.api.dto.JobApplicationRequest;
import com.jobtracker.api.dto.JobApplicationResponse;
import com.jobtracker.api.dto.JobApplicationSummaryResponse;
import com.jobtracker.api.exception.ApplicationNotFoundException;
import com.jobtracker.api.exception.ContactNotFoundException;
import com.jobtracker.api.mapper.ApplicationMapper;
import com.jobtracker.api.model.ApplicationStatus;
import com.jobtracker.api.model.Contact;
import com.jobtracker.api.model.JobApplication;
import com.jobtracker.api.model.User;
import com.jobtracker.api.repository.ApplicationRepository;
import com.jobtracker.api.repository.ApplicationSpecifications;
import com.jobtracker.api.repository.ContactRepository;
import com.jobtracker.api.security.CurrentUserProvider;

import jakarta.transaction.Transactional;

@Service
public class ApplicationServiceImpl implements ApplicationService {
    private final CurrentUserProvider currentUserProvider;
    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;
    private final ContactRepository contactRepository;

    public ApplicationServiceImpl(CurrentUserProvider currentUserProvider, ApplicationRepository applicationRepository,
            ApplicationMapper applicationMapper, ContactRepository contactRepository) {
        this.currentUserProvider = currentUserProvider;
        this.applicationRepository = applicationRepository;
        this.applicationMapper = applicationMapper;
        this.contactRepository = contactRepository;
    }

    @Transactional
    @Override
    public JobApplicationResponse createApplication(JobApplicationRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();

        JobApplication jobApplication = new JobApplication();
        jobApplication.setUser(currentUser);
        jobApplication.setCompany(request.company());
        jobApplication.setRoleTitle(request.roleTitle());
        jobApplication.setJobId(request.jobId());
        jobApplication.setJobUrl(request.jobUrl());
        if (request.status() != null) {
            jobApplication.setStatus(request.status());
        }
        jobApplication.setSource(request.source());
        jobApplication.setNotes(request.notes());
        jobApplication.setSalaryRange(request.salaryRange());
        jobApplication.setLocation(request.location());
        jobApplication.setAppliedDate(request.appliedDate());

        List<UUID> contactIds = request.contactIds() == null ? List.of() : request.contactIds();
        if (!contactIds.isEmpty()) {
            List<Contact> contacts = contactRepository.findByIdInAndUser(contactIds, currentUser);

            if (contacts.size() != contactIds.size()) {
                throw new ContactNotFoundException("One or more contacts not found");
            }

            for (Contact contact : contacts) {
                jobApplication.addContact(contact);
            }
        }

        JobApplication savedJobApplication = applicationRepository.save(jobApplication);
        return applicationMapper.toResponse(savedJobApplication);
    }

    @Override
    public JobApplicationResponse getApplicationById(UUID id) {
        User currentUser = currentUserProvider.getCurrentUser();

        JobApplication jobApplication = applicationRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ApplicationNotFoundException("Job application with id " + id + " not found"));

        return applicationMapper.toResponse(jobApplication);
    }

    @Override
    public Page<JobApplicationSummaryResponse> getAllApplicationsForCurrentUser(ApplicationStatus status, Pageable pageable) {
        User currentUser = currentUserProvider.getCurrentUser();

        Specification<JobApplication> spec = Specification.where(ApplicationSpecifications.hasUser(currentUser));

        if(status != null){
            spec = spec.and(ApplicationSpecifications.hasStatus(status));
        }
        
        Page<JobApplication> jobApplications = applicationRepository.findAll(spec, pageable);
        return jobApplications.map(applicationMapper::toSummaryResponse);
    }

    @Transactional 
    @Override
    public JobApplicationResponse updateApplication(UUID id, JobApplicationRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();

        JobApplication jobApplication = applicationRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ApplicationNotFoundException("Job application with id " + id + " not found"));

        if (request.status() == null) {
            throw new IllegalArgumentException("Status is required");
        }

        jobApplication.setCompany(request.company());
        jobApplication.setRoleTitle(request.roleTitle());
        jobApplication.setJobId(request.jobId());
        jobApplication.setJobUrl(request.jobUrl());
        jobApplication.setStatus(request.status());
        jobApplication.setSource(request.source());
        jobApplication.setNotes(request.notes());
        jobApplication.setSalaryRange(request.salaryRange());
        jobApplication.setLocation(request.location());
        jobApplication.setAppliedDate(request.appliedDate());

        List<UUID> contactIds = request.contactIds() == null ? List.of() : request.contactIds();
        Set<UUID> requestedContactIds = new HashSet<>(contactIds);
        Set<Contact> existingContacts = jobApplication.getContacts();
        Set<UUID> existingContactIds = existingContacts.stream()
                .map(Contact::getId)
                .collect(Collectors.toSet());

        if (!existingContactIds.equals(requestedContactIds)) {
            Set<Contact> contactsToRemove = existingContacts.stream()
                    .filter(contact -> !requestedContactIds.contains(contact.getId()))
                    .collect(Collectors.toSet());

            Set<UUID> contactIdsToAdd = requestedContactIds.stream()
                    .filter(contactId -> !existingContactIds.contains(contactId))
                    .collect(Collectors.toSet());

            for (Contact contact : contactsToRemove) {
                jobApplication.removeContact(contact);
            }

            if (!contactIdsToAdd.isEmpty()) {
                List<Contact> contactsToAdd = contactRepository
                        .findByIdInAndUser(new ArrayList<>(contactIdsToAdd), currentUser);

                if (contactsToAdd.size() != contactIdsToAdd.size()) {
                    throw new ContactNotFoundException("One or more contacts not found");
                }

                for (Contact contact : contactsToAdd) {
                    jobApplication.addContact(contact);
                }
            }
        }

        JobApplication savedJobApplication = applicationRepository.save(jobApplication);
        return applicationMapper.toResponse(savedJobApplication);
    }

    @Override
    public JobApplicationResponse updateStatus(UUID id, ApplicationStatus applicationStatus) {
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
    public void deleteApplication(UUID id) {
        User currentUser = currentUserProvider.getCurrentUser();

        JobApplication jobApplication = applicationRepository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new ApplicationNotFoundException("Job application with id " + id + " not found"));
        
        Set<Contact> existingContacts = new HashSet<>(jobApplication.getContacts());
        for(Contact contact: existingContacts){
            jobApplication.removeContact(contact);
        }

        applicationRepository.delete(jobApplication);
    }
}
