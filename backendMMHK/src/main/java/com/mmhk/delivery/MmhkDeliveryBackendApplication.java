package com.mmhk.delivery;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MmhkDeliveryBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MmhkDeliveryBackendApplication.class, args);
	}

}
