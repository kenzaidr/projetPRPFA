package com.mmhk.delivery.features.user.ride.controller;

import com.mmhk.delivery.features.user.ride.dto.RideRequestDTO;
import com.mmhk.delivery.features.user.ride.dto.RideResponseDTO;
import com.mmhk.delivery.features.user.ride.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class RideController {

    private final RideService rideService;

    @PostMapping
    public ResponseEntity<RideResponseDTO> createRide(
            @RequestBody RideRequestDTO request
    ) {
        return ResponseEntity.ok(
                rideService.createRide(request)
        );
    }
}