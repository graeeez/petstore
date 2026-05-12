package com.pastoral.petstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Main Spring Boot application class for Petstore e-commerce backend service.
 * Enables auto-configuration and component scanning for the com.pastoral.petstore package.
 */
@SpringBootApplication
public class PetstoreBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PetstoreBackendApplication.class, args);
    }

    /**
     * Global CORS configuration to allow the frontend to communicate with the backend.
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD")
                        .allowedHeaders("*")
                        .allowCredentials(false)
                        .maxAge(3600);
            }
        };
    }
}
