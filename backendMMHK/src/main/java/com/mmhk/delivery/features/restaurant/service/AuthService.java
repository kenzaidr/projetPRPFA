package com.mmhk.delivery.features.restaurant.service;



import com.mmhk.delivery.features.restaurant.dto.LoginRequest;
import com.mmhk.delivery.features.restaurant.dto.LoginResponse;
import com.mmhk.delivery.features.restaurant.dto.RegisterRequest;
import com.mmhk.delivery.features.restaurant.dto.RegisterResponse;


import com.mmhk.delivery.features.restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.mmhk.delivery.features.restaurant.model.User;

import java.util.List;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // LOGIN
    public LoginResponse login(LoginRequest request) {
        // Chercher l'utilisateur
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return new LoginResponse(null, request.getEmail(), "Utilisateur non trouvé");
        }

        // Vérifier mot de passe (en clair pour test)
        if (!user.getPassword().equals(request.getPassword())) {
            return new LoginResponse(null, request.getEmail(), "Mot de passe incorrect");
        }

        // Succès - générer token simple
        String token = generateSimpleToken(user.getEmail());

        return new LoginResponse(token, user.getEmail(), "Connexion réussie");
    }

    // REGISTER
    public RegisterResponse register(RegisterRequest request) {
        // Vérifier si email existe
        if (userRepository.existsByEmail(request.getEmail())) {
            return new RegisterResponse(request.getEmail(), "Email déjà utilisé");
        }

        // Créer nouvel utilisateur
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // En clair pour test
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());

        // Sauvegarder
        userRepository.save(user);

        return new RegisterResponse(user.getEmail(), "Inscription réussie");
    }

    // GET ALL USERS
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // VALIDATE TOKEN (simple pour test)
    public boolean validateToken(String token, String email) {
        try {
            // Décoder le token simple
            String decoded = new String(java.util.Base64.getDecoder().decode(token));
            String[] parts = decoded.split(":");
            return parts.length == 2 && parts[0].equals(email);
        } catch (Exception e) {
            return false;
        }
    }

    // GENERATE SIMPLE TOKEN
    private String generateSimpleToken(String email) {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String data = email + ":" + timestamp;
        return java.util.Base64.getEncoder().encodeToString(data.getBytes());
    }
}
