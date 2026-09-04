package com.jobtracker.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jobtracker.api.model.Contact;
import com.jobtracker.api.model.User;

@Repository 
public interface ContactRepository extends JpaRepository<Contact, UUID> {

    List<Contact> findByUser(User user);

    Optional<Contact> findByIdAndUser(UUID id, User user);
}
