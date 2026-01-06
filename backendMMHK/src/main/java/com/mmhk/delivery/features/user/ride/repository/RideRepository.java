package com.mmhk.delivery.features.user.ride.repository;

import com.mmhk.delivery.features.user.ride.model.Ride;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByClientId(Long clientId);
}
