package com.mmhk.delivery.features.user.ride.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class RideRequestDTO {

    private Long clientId;

    private String pickup;
    private Double pickupLat;
    private Double pickupLng;

    private String destination;
    private Double destinationLat;
    private Double destinationLng;

    private List<StopDTO> stops;
}
