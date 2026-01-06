package com.mmhk.delivery.features.user.ride.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RideResponseDTO {

    private Long rideId;
    private Double distanceKm;
    private Integer durationMin;
    private Double price;
    private String status;
}
