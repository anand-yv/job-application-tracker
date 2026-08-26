package com.jobtracker.api.config;

import java.util.List;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.jobtracker.api.security.JwtAuthFilter;

@Configuration
@EnableConfigurationProperties(CorsProperties.class)
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationEntryPoint entryPoint;
    private final CorsProperties corsProperties;

    SecurityConfig(
            JwtAuthFilter jwtAuthFilter,
            AuthenticationEntryPoint entryPoint,
            CorsProperties corsProperties) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.entryPoint = entryPoint;
        this.corsProperties = corsProperties;
    }

    @Bean
    public SecurityFilterChain appSecurityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex.authenticationEntryPoint(entryPoint));
        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(corsProperties.allowedOrigins());
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        config.setExposedHeaders(List.of("Authorization"));
        // it means allow cookies / auth-creadentials - and cannot use with allowed-origins(*)
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply this config to all paths (/** )
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
