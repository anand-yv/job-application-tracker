package com.jobtracker.api.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends  OncePerRequestFilter{
    // This filter will run only ONE time for every HTTP request before it reaches to controller.
    // Its used to authenticate the request.
    private final JwtUtil jwtUtil;
    JwtAuthFilter(JwtUtil jwtUtil){
        this.jwtUtil = jwtUtil;
    }
    
    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest,  HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException{
        String authHeader  = httpServletRequest.getHeader("Authorization");
        if(authHeader  == null || !authHeader.startsWith("Bearer ")){
            // For public endpoints like /auth/login likewise.
            filterChain.doFilter(httpServletRequest, response);
            return;
        }
        String token = authHeader.substring(7);
        String email;

        try{
            email = jwtUtil.extractEmail(token);
        } catch(Exception e){
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }


        // Spring Security authentication object
        // Telling this user is authenticated
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(email, null, List.of());

        // Tells Spring Security which user is authenticated
        SecurityContextHolder.getContext().setAuthentication(authToken);
        filterChain.doFilter(httpServletRequest, response);

    }
}
