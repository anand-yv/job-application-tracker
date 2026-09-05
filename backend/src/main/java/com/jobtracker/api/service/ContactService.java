package com.jobtracker.api.service;

import java.util.List;
import java.util.UUID;

import com.jobtracker.api.dto.ContactRequest;
import com.jobtracker.api.dto.ContactResponse;

public interface ContactService {

    ContactResponse createContact(ContactRequest contactRequest);

    ContactResponse getContactById(UUID id);

    List<ContactResponse> getAllContacts();

    ContactResponse updateContact(UUID id, ContactRequest contactRequest);

    void deleteContact(UUID id);
}
