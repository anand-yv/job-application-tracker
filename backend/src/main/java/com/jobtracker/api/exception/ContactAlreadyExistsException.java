package com.jobtracker.api.exception;

public class ContactAlreadyExistsException extends RuntimeException {
    public ContactAlreadyExistsException(String message){
        super(message);
    }
}
