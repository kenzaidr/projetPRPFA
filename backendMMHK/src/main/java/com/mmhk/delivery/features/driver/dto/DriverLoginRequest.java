package com.mmhk.delivery.features.driver.dto;

public class DriverLoginRequest {
    private String email;
    private String password;

    public DriverLoginRequest() {}

    public DriverLoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

