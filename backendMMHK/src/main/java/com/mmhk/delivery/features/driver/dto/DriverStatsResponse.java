package com.mmhk.delivery.features.driver.dto;

import java.time.LocalDateTime;

public class DriverStatsResponse {
    private Double todayEarnings;
    private Integer totalRides;
    private Double onlineHours;
    private Double acceptanceRate;
    private Double rating;
    private Boolean isOnline;
    private LocalDateTime lastOnlineAt;

    public DriverStatsResponse() {}

    public DriverStatsResponse(Double todayEarnings, Integer totalRides, Double onlineHours, 
                               Double acceptanceRate, Double rating, Boolean isOnline, LocalDateTime lastOnlineAt) {
        this.todayEarnings = todayEarnings;
        this.totalRides = totalRides;
        this.onlineHours = onlineHours;
        this.acceptanceRate = acceptanceRate;
        this.rating = rating;
        this.isOnline = isOnline;
        this.lastOnlineAt = lastOnlineAt;
    }

    public Double getTodayEarnings() {
        return todayEarnings;
    }

    public void setTodayEarnings(Double todayEarnings) {
        this.todayEarnings = todayEarnings;
    }

    public Integer getTotalRides() {
        return totalRides;
    }

    public void setTotalRides(Integer totalRides) {
        this.totalRides = totalRides;
    }

    public Double getOnlineHours() {
        return onlineHours;
    }

    public void setOnlineHours(Double onlineHours) {
        this.onlineHours = onlineHours;
    }

    public Double getAcceptanceRate() {
        return acceptanceRate;
    }

    public void setAcceptanceRate(Double acceptanceRate) {
        this.acceptanceRate = acceptanceRate;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Boolean getIsOnline() {
        return isOnline;
    }

    public void setIsOnline(Boolean isOnline) {
        this.isOnline = isOnline;
    }

    public LocalDateTime getLastOnlineAt() {
        return lastOnlineAt;
    }

    public void setLastOnlineAt(LocalDateTime lastOnlineAt) {
        this.lastOnlineAt = lastOnlineAt;
    }
}


