package com.jobtracker.api.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jobtracker.api.dto.JobApplicationRequest;
import com.jobtracker.api.dto.JobApplicationResponse;
import com.jobtracker.api.dto.JobApplicationSummaryResponse;
import com.jobtracker.api.dto.UpdateApplicationStatusRequest;
import com.jobtracker.api.model.ApplicationStatus;
import com.jobtracker.api.service.ApplicationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService){
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<JobApplicationResponse> createApplication(@Valid @RequestBody JobApplicationRequest jobApplicationRequest){
        JobApplicationResponse jobApplicationResponse = applicationService.createApplication(jobApplicationRequest);
        return new ResponseEntity<JobApplicationResponse>(jobApplicationResponse, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> getApplicationById(@PathVariable UUID id){
        JobApplicationResponse jobApplicationResponse = applicationService.getApplicationById(id);
        return new ResponseEntity<JobApplicationResponse>(jobApplicationResponse, HttpStatus.OK);
    }

    @GetMapping
     public ResponseEntity<Page<JobApplicationSummaryResponse>> getAllApplicationsForCurrentUser(@RequestParam(required = false) ApplicationStatus status,  Pageable pageable){
        Page<JobApplicationSummaryResponse> jobApplicationResponses = applicationService.getAllApplicationsForCurrentUser(status, pageable);
        return ResponseEntity.ok(jobApplicationResponses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobApplicationResponse> updateApplication(@PathVariable UUID id, @Valid @RequestBody JobApplicationRequest jobApplicationRequest){
        JobApplicationResponse jobApplicationResponse = applicationService.updateApplication(id, jobApplicationRequest);
        return new ResponseEntity<JobApplicationResponse>(jobApplicationResponse, HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<JobApplicationResponse> updateStatus(@PathVariable UUID id, @Valid @RequestBody UpdateApplicationStatusRequest request){
        JobApplicationResponse jobApplicationResponse = applicationService.updateStatus(id, request.status());
        return new ResponseEntity<JobApplicationResponse>(jobApplicationResponse, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable UUID id){
        applicationService.deleteApplication(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
