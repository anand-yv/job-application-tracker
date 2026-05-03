package com.jobtracker.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JobTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(JobTrackerApplication.class, args);
	}

	/* 
	@Bean
	CommandLineRunner testJwt(JwtUtil jwtUtil){
		return args -> {
			System.out.println("\n========== JWT TEST ==========");

			// Test 1: Generate a token
			String email = "anand93056ad@gmail.com";
			String token = jwtUtil.generateToken(email);
			System.out.println("Generatd token: " + token);

			// Test 2: Extract Email
			String extractedEmail = jwtUtil.extractEmail(token);
			System.out.println("Extract Email: "+ extractedEmail);

			// Test 3: Verify they match
            System.out.println("Match: " + email.equals(extractedEmail));
            
            System.out.println("==============================\n");

		};
	}
	*/

}
