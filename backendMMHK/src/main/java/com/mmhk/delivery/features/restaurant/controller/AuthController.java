package com.mmhk.delivery.features.restaurant.controller;

import com.mmhk.delivery.features.restaurant.dto.LoginRequest;
import com.mmhk.delivery.features.restaurant.dto.LoginResponse;
import com.mmhk.delivery.features.restaurant.dto.RegisterRequest;
import com.mmhk.delivery.features.restaurant.dto.RegisterResponse;
import com.mmhk.delivery.features.restaurant.model.User;
import com.mmhk.delivery.features.restaurant.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // Pour les tests
public class AuthController {

    @Autowired
    private AuthService authService;

    // Endpoint de connexion
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        System.out.println("Login attempt for: " + request.getEmail());

        LoginResponse response = authService.login(request);

        if (response.getToken() != null) {
            // Connexion réussie
            return ResponseEntity.ok(response);
        } else {
            // Échec de connexion
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // Endpoint d'inscription
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest request) {
        System.out.println("Register attempt for: " + request.getEmail());

        RegisterResponse response = authService.register(request);

        if (response.getMessage().equals("Inscription réussie")) {
            // Inscription réussie
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            // Échec d'inscription
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // Endpoint pour lister les utilisateurs (pour test seulement)
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Endpoint de test
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth API is working!");
    }

    // Endpoint pour vérifier un token
    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(
            @RequestParam String token,
            @RequestParam String email) {

        boolean isValid = authService.validateToken(token, email);

        if (isValid) {
            return ResponseEntity.ok("Token is valid for email: " + email);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    // Endpoint de création rapide d'utilisateur test
    @PostMapping("/create-test-user")
    public ResponseEntity<String> createTestUser() {
        RegisterRequest testUser = new RegisterRequest();
        testUser.setEmail("test@example.com");
        testUser.setPassword("password123");
        testUser.setName("Test User");
        testUser.setPhone("+1234567890");
        testUser.setRole("USER");

        RegisterResponse response = authService.register(testUser);

        return ResponseEntity.ok("Test user created: " + response.getMessage());
    }
}