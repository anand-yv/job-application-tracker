package com.jobtracker.api.exception;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.jobtracker.api.dto.ErrorResponse;

@RestControllerAdvice // Hey Spring, this class will catch errors for ALL controllers
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private ResponseEntity<ErrorResponse> buildErrorResponse(String message, HttpStatus status, Exception ex){
        if (status.is5xxServerError()) {
            logger.error("{} - {}: {}", status, ex.getClass().getSimpleName(), message, ex);
        } else {
            logger.warn("{} - {}: {}", status, ex.getClass().getSimpleName(), message);
        }
        ErrorResponse errorResponse = new ErrorResponse(
            LocalDateTime.now(),
            status.value(),
            status.getReasonPhrase(),
            message
        );
        return new ResponseEntity<>(errorResponse, status);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleEmailAlreadyExists(EmailAlreadyExistsException ex){
        return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST, ex);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleWrongPassword(InvalidCredentialsException ex){
        return buildErrorResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED, ex);
    }

    @ExceptionHandler(ApplicationNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleApplicationNotFound(ApplicationNotFoundException ex){
        return buildErrorResponse(ex.getMessage(), HttpStatus.NOT_FOUND, ex);
    }

    // This is done for validation of the DTO
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex){
        String message = ex.getBindingResult().getFieldErrors().stream()
            .findFirst()
            .map(err -> err.getField() + ": " + err.getDefaultMessage())
            .orElse("Validation failed");
        return buildErrorResponse(message, HttpStatus.BAD_REQUEST, ex);
    }

    // This is for if the JSON that is coming is invalid
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleMalformedJson(HttpMessageNotReadableException ex){
        return buildErrorResponse("Malformed JSON request", HttpStatus.BAD_REQUEST, ex);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex){
        logger.error("Unhandled exception occured : ", ex);
        return buildErrorResponse("Something went wrong : " + ex.getClass().getSimpleName(), HttpStatus.INTERNAL_SERVER_ERROR, ex);
    }
}
