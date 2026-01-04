// src/main/java/com/mmhk/delivery/features/user/controller/UserController.java
package com.mmhk.delivery.features.restaurant.controller;

import com.mmhk.delivery.features.restaurant.model.User;
import com.mmhk.delivery.features.restaurant.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Email déjà utilisé");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // en clair pour test

        userRepository.save(user);
        return ResponseEntity.ok("Compte créé");
    }
}
