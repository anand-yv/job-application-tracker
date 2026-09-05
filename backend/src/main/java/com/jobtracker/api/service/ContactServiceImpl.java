package com.jobtracker.api.service;

import java.util.List;
import java.util.UUID;

import com.jobtracker.api.exception.ContactNotFoundException;
import org.springframework.stereotype.Service;

import com.jobtracker.api.dto.ContactRequest;
import com.jobtracker.api.dto.ContactResponse;
import com.jobtracker.api.mapper.ContactMapper;
import com.jobtracker.api.model.Contact;
import com.jobtracker.api.model.User;
import com.jobtracker.api.repository.ContactRepository;
import com.jobtracker.api.security.CurrentUserProvider;

@Service 
public class ContactServiceImpl implements ContactService {
    private final CurrentUserProvider currentUserProvider;
    private final ContactRepository contactRepository;
    private final ContactMapper contactMapper;

    public ContactServiceImpl(CurrentUserProvider currentUserProvider, ContactRepository contactRepository, ContactMapper contactMapper){
        this.currentUserProvider = currentUserProvider;
        this.contactRepository = contactRepository;
        this.contactMapper = contactMapper;
    }

    @Override 
    public ContactResponse createContact(ContactRequest contactRequest){
        User currentUser = currentUserProvider.getCurrentUser();
        Contact contact = contactMapper.toEntity(contactRequest, currentUser);
        Contact savedContact = contactRepository.save(contact);
        return contactMapper.toResponse(savedContact);
    }

    @Override 
    public ContactResponse getContactById(UUID id){
        User currentUser = currentUserProvider.getCurrentUser();
        Contact contact = contactRepository.findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new ContactNotFoundException("Contact with id " + id + " not found"));
        return contactMapper.toResponse(contact);
    }

    @Override
    public List<ContactResponse> getAllContacts(){
        User currentUser = currentUserProvider.getCurrentUser();
        List<Contact> contacts = contactRepository.findByUser(currentUser);
        return contacts.stream()
                .map(contactMapper::toResponse)
                .toList();
    }

    @Override
    public ContactResponse updateContact(UUID id, ContactRequest contactRequest) {
        User currentUser = currentUserProvider.getCurrentUser();
        Contact contact = contactRepository.findByIdAndUser(id, currentUser)
            .orElseThrow(() -> new ContactNotFoundException("Contact with id " + id + " not found"));

        contact.setName(contactRequest.name());
        contact.setEmail(contactRequest.email());
        contact.setPhone(contactRequest.phone());
        contact.setCompany(contactRequest.company());
        contact.setPosition(contactRequest.position());
        contact.setNotes(contactRequest.notes());

        Contact updatedContact = contactRepository.save(contact);
        return contactMapper.toResponse(updatedContact);
    }

    @Override 
    public void deleteContact(UUID id){
        User currentUser = currentUserProvider.getCurrentUser();
        Contact contact = contactRepository.findByIdAndUser(id, currentUser)
           .orElseThrow(() -> new ContactNotFoundException("Contact with id " + id + " not found"));
        contactRepository.delete(contact);
    }

}
