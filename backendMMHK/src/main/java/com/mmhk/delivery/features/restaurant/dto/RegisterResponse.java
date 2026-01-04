package com.mmhk.delivery.features.restaurant.dto;

public class RegisterResponse {
    private String message;
    private String email;

    public RegisterResponse(String email, String message) {
        this.email = email;
        this.message = message;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
