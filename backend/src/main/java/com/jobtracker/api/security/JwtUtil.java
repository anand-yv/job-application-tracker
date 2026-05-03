package com.jobtracker.api.security;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(String email) {
        return Jwts.builder() // It return builder object
            .subject(email) // all of them return builder object by setting upt the values for the object and return object 
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(Keys.hmacShaKeyFor(secret.getBytes())) 
                // secret.getBytes() → byte[]
                // Keys.hmacShaKeyFor() → converts byte[] to SecretKey for HMAC signing
            .compact(); // return token header.payload.signature
    }

    public String extractEmail(String token) {
        // This method also validates the token and extracts the email from it,
        // since the email is required for each operation. If the token is invalid,
        // an exception is thrown, which is then handled by the security filter chain.

        // In method chains, each method returns an object, and the next method in the chain belongs to that returned object's class.

        return Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secret.getBytes()))
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}