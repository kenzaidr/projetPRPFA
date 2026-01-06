package com.mmhk.delivery.features.driver.dto;

public class UpdateOnlineStatusRequest {
    private Boolean isOnline;

    public UpdateOnlineStatusRequest() {}

    public UpdateOnlineStatusRequest(Boolean isOnline) {
        this.isOnline = isOnline;
    }

    public Boolean getIsOnline() {
        return isOnline;
    }

    public void setIsOnline(Boolean isOnline) {
        this.isOnline = isOnline;
    }
}



