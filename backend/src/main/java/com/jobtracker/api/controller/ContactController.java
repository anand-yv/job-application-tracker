package com.jobtracker.api.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobtracker.api.dto.ContactRequest;
import com.jobtracker.api.dto.ContactResponse;
import com.jobtracker.api.service.ContactService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/contacts")
public class ContactController {
    private final ContactService contactService;
    
    public ContactController(ContactService contactService){
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<ContactResponse> createContact(@Valid @RequestBody ContactRequest contactRequest){
        ContactResponse contactResponse  = contactService.createContact(contactRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(contactResponse);
    }

    @GetMapping
    public ResponseEntity<List<ContactResponse>> getAllContacts(){
        List<ContactResponse> contactResponses  = contactService.getAllContacts();
        return ResponseEntity.ok(contactResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactResponse> getContactById(@PathVariable UUID id){
        ContactResponse contactResponse  = contactService.getContactById(id);
        return ResponseEntity.ok(contactResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactResponse> updateContact(@PathVariable UUID id, @Valid @RequestBody ContactRequest contactRequest){
        ContactResponse contactResponse  = contactService.updateContact(id, contactRequest);
        return ResponseEntity.ok(contactResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContactById(@PathVariable UUID id){
        contactService.deleteContactById(id);
        return ResponseEntity.noContent().build();
    }
}
