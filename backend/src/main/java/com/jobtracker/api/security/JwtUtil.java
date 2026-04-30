package com.jobtracker.api.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(String email){
        // TODO
    }

    public String extractEmail(String token){
        // TODO 
        
        // This method also validates the token and extracts the email from it,
        // since the email is required for each operation. If the token is invalid,
        // an exception is thrown, which is then handled by the security filter chain.
         
    }
}