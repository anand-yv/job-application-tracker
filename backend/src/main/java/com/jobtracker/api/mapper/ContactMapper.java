package com.jobtracker.api.mapper;

import org.springframework.stereotype.Component;

import com.jobtracker.api.dto.ContactResponse;
import com.jobtracker.api.dto.ContactRequest;
import com.jobtracker.api.model.Contact;
import com.jobtracker.api.model.User;

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

    public Contact toEntity(ContactRequest request, User user) {
        Contact contact = new Contact();
        contact.setUser(user);
        contact.setName(request.name());
        contact.setEmail(request.email());
        contact.setPhone(request.phone());
        contact.setCompany(request.company());
        contact.setPosition(request.position());
        contact.setNotes(request.notes());
        return contact;
    }
}
