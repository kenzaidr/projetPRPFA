package com.mmhk.delivery.features.user.ride.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ride_stop")
@Getter
@Setter
public class RideStop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer stopOrder;
    private String address;
    private Double lat;
    private Double lng;

    @ManyToOne
    @JoinColumn(name = "ride_id")
    private Ride ride;
}
