package com.jobtracker.api.exception;

public class ApplicationNotFoundException extends RuntimeException {
    public ApplicationNotFoundException(String message){
        super(message);
    }
}
