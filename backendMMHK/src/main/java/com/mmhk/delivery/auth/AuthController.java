package com.mmhk.delivery.auth;

import com.mmhk.delivery.features.user.model.User;
import com.mmhk.delivery.features.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(null, null, "Utilisateur introuvable"));
        }

        boolean passwordOk = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordOk) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new LoginResponse(null, null, "Mot de passe incorrect"));
        }

        String fakeToken = "dummy-token";

        LoginResponse response = new LoginResponse(
                fakeToken,
                user.getEmail(),
                "Login réussi"
        );

        return ResponseEntity.ok(response);
    }
}