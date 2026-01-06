package com.mmhk.delivery.features.user.ride.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StopDTO {
    private String address;
    private Double lat;
    private Double lng;
    private Integer order;
}
