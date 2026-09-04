package com.jobtracker.api.mapper;

import org.springframework.stereotype.Component;

import com.jobtracker.api.dto.ContactResponse;
import com.jobtracker.api.model.Contact;

@Component 
public class ContactMapper {
    public ContactResponse toResponse(Contact contact){
        return new ContactResponse(
            contact.getId(),
            contact.getName(),
            contact.getEmail(),
            contact.getPhone(),
            contact.getCompany(),
            contact.getPosition(),
            contact.getNotes(),
            contact.getCreatedAt(),
            contact.getUpdatedAt()
        );
    }
}
