package com.mmhk.delivery.features.driver.dto;

public class DriverLoginResponse {
    private String token;
    private String email;
    private String message;
    private Long driverId;
    private String name;

    public DriverLoginResponse() {}

    public DriverLoginResponse(String token, String email, String message, Long driverId, String name) {
        this.token = token;
        this.email = email;
        this.message = message;
        this.driverId = driverId;
        this.name = name;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

