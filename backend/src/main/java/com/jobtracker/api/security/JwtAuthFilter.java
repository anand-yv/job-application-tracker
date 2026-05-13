package com.jobtracker.api.security;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends  OncePerRequestFilter{
    
    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest,  HttpServletResponse response, FilterChain filterChain){

    }
}
