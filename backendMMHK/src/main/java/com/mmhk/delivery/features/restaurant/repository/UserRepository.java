package com.mmhk.delivery.features.restaurant.repository;


import com.mmhk.delivery.features.restaurant.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}