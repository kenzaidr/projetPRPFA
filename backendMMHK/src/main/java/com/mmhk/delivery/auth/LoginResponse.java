
package com.mmhk.delivery.auth;
public class LoginResponse {
    private String token;
    private String message;
    private String email;

    public LoginResponse(String token,String email, String message) {
        this.token = token;
        this.message = message;
        this.email=email;
    }

    public String getToken() { return token; }
    public String getMessage() { return message; }
    public String getEmail(){return email;}
}
