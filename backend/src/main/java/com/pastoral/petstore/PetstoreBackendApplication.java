package com.pastoral.petstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import com.pastoral.petstore.listing.model.PetCategory;
import com.pastoral.petstore.listing.model.PetListing;
import com.pastoral.petstore.listing.repository.ListingRepository;
import org.springframework.boot.CommandLineRunner;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

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
     * Foolproof data seeder for production.
     */
    @Bean
    public CommandLineRunner dataLoader(ListingRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.saveAll(List.of(
                    PetListing.builder().name("Golden Retriever").category(PetCategory.DOGS).price(new BigDecimal("899.99")).availability(true).description("Friendly puppy").imageUrl("https://images.unsplash.com/photo-1611250282006-4484dd3fba6b").build(),
                    PetListing.builder().name("Siamese Kitten").category(PetCategory.CATS).price(new BigDecimal("299.99")).availability(true).description("Blue-eyed kitten").imageUrl("https://images.unsplash.com/photo-1595433707802-6b2626ef1c91").build(),
                    PetListing.builder().name("Amazon Parrot").category(PetCategory.BIRDS).price(new BigDecimal("1299.99")).availability(true).description("Colorful parrot").imageUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbQYhoHblQZuzn4FA2HUtE8paXFldGXy6rOA&s").build(),
                    PetListing.builder().name("Goldfish").category(PetCategory.FISHES).price(new BigDecimal("19.99")).availability(true).description("Easy care").imageUrl("https://images.unsplash.com/photo-1574158622682-e40e69881006").build()
                ));
            }
        };
    }

    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(0);
        return bean;
    }
}
