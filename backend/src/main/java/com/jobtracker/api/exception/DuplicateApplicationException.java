package com.jobtracker.api.exception;

public class DuplicateApplicationException extends RuntimeException {
    public DuplicateApplicationException(String message){
        super(message);
    }
}
