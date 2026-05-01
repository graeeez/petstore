package com.pastoral.petstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Spring Boot application class for Petstore e-commerce backend service.
 * Enables auto-configuration and component scanning for the com.pastoral.petstore package.
 */
@SpringBootApplication
public class PetstoreBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PetstoreBackendApplication.class, args);
    }
}
