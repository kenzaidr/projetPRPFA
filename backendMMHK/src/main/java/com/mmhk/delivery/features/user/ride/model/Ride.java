package com.mmhk.delivery.features.user.ride.model;

import com.mmhk.delivery.features.user.ride.enums.RideStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ride")
@Getter
@Setter
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long clientId;

    private String pickupAddress;
    private Double pickupLat;
    private Double pickupLng;

    private String destinationAddress;
    private Double destinationLat;
    private Double destinationLng;

    private Double distanceKm;
    private Integer durationMin;
    private Double price;

    @Enumerated(EnumType.STRING)
    private RideStatus status;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "ride", cascade = CascadeType.ALL)
    private List<RideStop> stops;
}
