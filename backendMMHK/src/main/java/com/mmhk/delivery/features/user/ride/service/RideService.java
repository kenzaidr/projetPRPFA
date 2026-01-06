package com.mmhk.delivery.features.user.ride.service;

import com.mmhk.delivery.features.user.ride.dto.RideRequestDTO;
import com.mmhk.delivery.features.user.ride.dto.RideResponseDTO;
import com.mmhk.delivery.features.user.ride.enums.RideStatus;
import com.mmhk.delivery.features.user.ride.model.Ride;
import com.mmhk.delivery.features.user.ride.repository.RideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;

    public RideResponseDTO createRide(RideRequestDTO dto) {

        Ride ride = new Ride();
        ride.setClientId(dto.getClientId());
        ride.setPickupAddress(dto.getPickup());
        ride.setPickupLat(dto.getPickupLat());
        ride.setPickupLng(dto.getPickupLng());
        ride.setDestinationAddress(dto.getDestination());
        ride.setDestinationLat(dto.getDestinationLat());
        ride.setDestinationLng(dto.getDestinationLng());

        double distance = estimateDistance();
        int duration = (int) (distance / 40 * 60);
        double price = distance * 3;

        ride.setDistanceKm(distance);
        ride.setDurationMin(duration);
        ride.setPrice(price);
        ride.setStatus(RideStatus.CREATED);

        Ride savedRide = rideRepository.save(ride);

        return new RideResponseDTO(
                savedRide.getId(),
                distance,
                duration,
                price,
                savedRide.getStatus().name()
        );
    }

    private double estimateDistance() {
        return 8.5; // estimation simple pour projet académique
    }
}
