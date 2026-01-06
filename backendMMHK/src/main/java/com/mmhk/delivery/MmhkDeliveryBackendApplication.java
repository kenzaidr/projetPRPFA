package com.mmhk.delivery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {"com.mmhk.delivery.features.restaurant.model", "com.mmhk.delivery.features.driver.model"})  // Ensures entities are scanned
@EnableJpaRepositories(basePackages = {"com.mmhk.delivery.features.restaurant.repository", "com.mmhk.delivery.features.driver.repository"})  // Ensures repos are scanned
public class MmhkDeliveryBackendApplication {
    public static void main(String[] args) {
        SpringApplication.run(MmhkDeliveryBackendApplication.class, args);
        System.out.println("✅ Server started on http://localhost:8080");

    }
}