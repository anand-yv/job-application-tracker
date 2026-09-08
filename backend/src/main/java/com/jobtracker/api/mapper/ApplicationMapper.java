package com.jobtracker.api.mapper;

import org.springframework.stereotype.Component;

import com.jobtracker.api.dto.JobApplicationResponse;
import com.jobtracker.api.model.JobApplication;

@Component
public class ApplicationMapper {

    private final ContactMapper contactMapper;

    public  ApplicationMapper(ContactMapper contactMapper){
        this.contactMapper = contactMapper;
    }

    public JobApplicationResponse toResponse(JobApplication entity){
        return new JobApplicationResponse(
            entity.getId(),
            entity.getJobId(),
            entity.getJobUrl(),
            entity.getCompany(),
            entity.getRoleTitle(),
            entity.getStatus(),
            entity.getSource(),
            entity.getNotes(),
            entity.getSalaryRange(),
            entity.getLocation(),
            entity.getAppliedDate(),
            entity.getContacts().stream()
                .map(contactMapper::toResponse)
                .toList(),
            entity.getCreatedAt(),
            entity.getUpdatedAt()
        );
    }
}
