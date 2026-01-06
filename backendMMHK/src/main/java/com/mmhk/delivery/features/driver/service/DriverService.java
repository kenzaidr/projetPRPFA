package com.mmhk.delivery.features.driver.service;

import com.mmhk.delivery.features.driver.dto.*;
import com.mmhk.delivery.features.driver.model.Driver;
import com.mmhk.delivery.features.driver.repository.DriverRepository;
import com.mmhk.delivery.features.restaurant.model.Order;
import com.mmhk.delivery.features.restaurant.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private OrderRepository orderRepository;

    // LOGIN
    public DriverLoginResponse login(DriverLoginRequest request) {
        Driver driver = driverRepository.findByEmail(request.getEmail()).orElse(null);

        if (driver == null) {
            return new DriverLoginResponse(null, request.getEmail(), "Driver not found", null, null);
        }

        // Verify password (plain text for now - should be hashed in production)
        if (!driver.getPassword().equals(request.getPassword())) {
            return new DriverLoginResponse(null, request.getEmail(), "Incorrect password", null, null);
        }

        // Generate token
        String token = generateSimpleToken(driver.getEmail());

        return new DriverLoginResponse(token, driver.getEmail(), "Login successful", driver.getId(), driver.getName());
    }

    // REGISTER
    public DriverRegisterResponse register(DriverRegisterRequest request) {
        // Check if email already exists
        if (driverRepository.existsByEmail(request.getEmail())) {
            return new DriverRegisterResponse(request.getEmail(), "Email already in use", null);
        }

        // Check if phone already exists
        if (driverRepository.existsByPhone(request.getPhone())) {
            return new DriverRegisterResponse(request.getEmail(), "Phone number already in use", null);
        }

        // Create new driver
        Driver driver = new Driver();
        driver.setName(request.getName());
        driver.setEmail(request.getEmail());
        driver.setPassword(request.getPassword()); // Should be hashed in production
        driver.setPhone(request.getPhone());
        driver.setVehicleModel(request.getVehicleModel());
        driver.setLicensePlate(request.getLicensePlate());
        driver.setVehicleColor(request.getVehicleColor());
        driver.setStatus("INACTIVE");
        driver.setIsOnline(false);

        // Save driver
        Driver savedDriver = driverRepository.save(driver);

        return new DriverRegisterResponse(savedDriver.getEmail(), "Registration successful", savedDriver.getId());
    }

    // GET DRIVER STATS
    public DriverStatsResponse getDriverStats(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        // Calculate today's earnings (assuming orders have a driverId field)
        // For now, we'll use a placeholder calculation
        Double todayEarnings = calculateTodayEarnings(driverId);
        
        // Calculate online hours (simplified - in production, track session times)
        Double onlineHours = calculateOnlineHours(driver);

        // Acceptance rate (placeholder - would need to track accepted vs declined requests)
        Double acceptanceRate = 98.0; // Default value

        return new DriverStatsResponse(
            todayEarnings,
            driver.getTotalRides(),
            onlineHours,
            acceptanceRate,
            driver.getRating(),
            driver.getIsOnline(),
            driver.getLastOnlineAt()
        );
    }

    // GET DRIVER PROFILE
    public DriverProfileResponse getDriverProfile(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        DriverProfileResponse response = new DriverProfileResponse();
        response.setId(driver.getId());
        response.setName(driver.getName());
        response.setEmail(driver.getEmail());
        response.setPhone(driver.getPhone());
        response.setVehicleModel(driver.getVehicleModel());
        response.setLicensePlate(driver.getLicensePlate());
        response.setVehicleColor(driver.getVehicleColor());
        response.setRating(driver.getRating());
        response.setTotalRides(driver.getTotalRides());
        response.setTotalEarnings(driver.getTotalEarnings());
        response.setLicenseVerified(driver.getLicenseVerified());
        response.setInsuranceVerified(driver.getInsuranceVerified());
        response.setIsOnline(driver.getIsOnline());
        response.setCreatedAt(driver.getCreatedAt());
        response.setLastOnlineAt(driver.getLastOnlineAt());

        return response;
    }

    // UPDATE ONLINE STATUS
    public void updateOnlineStatus(Long driverId, Boolean isOnline) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        driver.setIsOnline(isOnline);
        if (isOnline) {
            driver.setStatus("ACTIVE");
            driver.setLastOnlineAt(LocalDateTime.now());
        } else {
            driver.setStatus("INACTIVE");
        }
        driverRepository.save(driver);
    }

    // UPDATE LOCATION
    public void updateLocation(Long driverId, UpdateLocationRequest request) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        driver.setLatitude(request.getLatitude());
        driver.setLongitude(request.getLongitude());
        driverRepository.save(driver);
    }

    // GET DRIVER ORDERS (orders assigned to this driver)
    public List<Order> getDriverOrders(Long driverId) {
        return orderRepository.findByDriverId(driverId);
    }

    // VALIDATE TOKEN
    public boolean validateToken(String token, String email) {
        try {
            String decoded = new String(java.util.Base64.getDecoder().decode(token));
            String[] parts = decoded.split(":");
            return parts.length == 2 && parts[0].equals(email);
        } catch (Exception e) {
            return false;
        }
    }

    // GET DRIVER BY EMAIL (for token validation)
    public Driver getDriverByEmail(String email) {
        return driverRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
    }

    // PRIVATE HELPER METHODS
    private String generateSimpleToken(String email) {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String data = email + ":" + timestamp;
        return java.util.Base64.getEncoder().encodeToString(data.getBytes());
    }

    private Double calculateTodayEarnings(Long driverId) {
        // Calculate earnings from orders assigned to this driver today
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(23, 59, 59);
        
        List<Order> todayOrders = orderRepository.findByDriverIdAndOrderDateBetween(
                driverId, startOfDay, endOfDay);

        // Sum up earnings (assuming a commission or delivery fee)
        // 10% commission example - adjust based on your business logic
        return todayOrders.stream()
                .mapToDouble(order -> order.getTotalAmount() * 0.1) // 10% commission example
                .sum();
    }

    private Double calculateOnlineHours(Driver driver) {
        // Simplified calculation - in production, track session start/end times
        if (driver.getLastOnlineAt() != null && driver.getIsOnline()) {
            long minutes = ChronoUnit.MINUTES.between(driver.getLastOnlineAt(), LocalDateTime.now());
            return minutes / 60.0;
        }
        return 0.0;
    }
}

