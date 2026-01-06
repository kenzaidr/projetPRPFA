package com.mmhk.delivery.features.driver.dto;

public class DriverRegisterResponse {
    private String email;
    private String message;
    private Long driverId;

    public DriverRegisterResponse() {}

    public DriverRegisterResponse(String email, String message, Long driverId) {
        this.email = email;
        this.message = message;
        this.driverId = driverId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }
}


