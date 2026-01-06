package com.mmhk.delivery.features.driver.controller;

import com.mmhk.delivery.features.driver.dto.*;
import com.mmhk.delivery.features.driver.service.DriverService;
import com.mmhk.delivery.features.driver.service.DriverOrderService;
import com.mmhk.delivery.features.driver.model.DriverOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drivers")
@CrossOrigin(origins = "http://localhost:5173")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @Autowired
    private DriverOrderService driverOrderService;

    // DRIVER LOGIN
    @PostMapping("/login")
    public ResponseEntity<DriverLoginResponse> login(@RequestBody DriverLoginRequest request) {
        System.out.println("Driver login attempt for: " + request.getEmail());

        DriverLoginResponse response = driverService.login(request);

        if (response.getToken() != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    // DRIVER REGISTRATION
    @PostMapping("/register")
    public ResponseEntity<DriverRegisterResponse> register(@RequestBody DriverRegisterRequest request) {
        System.out.println("Driver registration attempt for: " + request.getEmail());

        DriverRegisterResponse response = driverService.register(request);

        if (response.getMessage().equals("Registration successful")) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // GET DRIVER STATS (for dashboard)
    @GetMapping("/{driverId}/stats")
    public ResponseEntity<DriverStatsResponse> getDriverStats(@PathVariable Long driverId) {
        try {
            DriverStatsResponse stats = driverService.getDriverStats(driverId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // GET DRIVER PROFILE
    @GetMapping("/{driverId}/profile")
    public ResponseEntity<DriverProfileResponse> getDriverProfile(@PathVariable Long driverId) {
        try {
            DriverProfileResponse profile = driverService.getDriverProfile(driverId);
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // UPDATE ONLINE STATUS
    @PutMapping("/{driverId}/status")
    public ResponseEntity<?> updateOnlineStatus(
            @PathVariable Long driverId,
            @RequestBody UpdateOnlineStatusRequest request) {
        try {
            driverService.updateOnlineStatus(driverId, request.getIsOnline());
            return ResponseEntity.ok("Status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Driver not found: " + e.getMessage());
        }
    }

    // UPDATE LOCATION
    @PutMapping("/{driverId}/location")
    public ResponseEntity<?> updateLocation(
            @PathVariable Long driverId,
            @RequestBody UpdateLocationRequest request) {
        try {
            driverService.updateLocation(driverId, request);
            return ResponseEntity.ok("Location updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Driver not found: " + e.getMessage());
        }
    }

    // GET DRIVER ORDERS
    @GetMapping("/{driverId}/orders")
    public ResponseEntity<List<DriverOrder>> getDriverOrders(@PathVariable Long driverId) {
        try {
            List<DriverOrder> orders = driverService.getDriverOrders(driverId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // GET AVAILABLE ORDERS (pending orders without driver)
    @GetMapping("/available-orders")
    public ResponseEntity<List<DriverOrder>> getAvailableOrders() {
        try {
            System.out.println("Fetching available driver orders...");
            List<DriverOrder> orders = driverService.getAvailableOrders();
            System.out.println("Returning " + orders.size() + " available driver orders");
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("Error fetching available orders: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ACCEPT ORDER
    @PostMapping("/{driverId}/orders/{orderId}/accept")
    @CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.POST, RequestMethod.OPTIONS}, allowedHeaders = "*")
    public ResponseEntity<?> acceptOrder(
            @PathVariable Long driverId,
            @PathVariable Long orderId) {
        try {
            DriverOrder order = driverService.acceptOrder(driverId, orderId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to accept order: " + e.getMessage());
        }
    }

    // COMPLETE ORDER
    @PostMapping("/{driverId}/orders/{orderId}/complete")
    @CrossOrigin(origins = "http://localhost:5173", methods = {RequestMethod.POST, RequestMethod.OPTIONS}, allowedHeaders = "*")
    public ResponseEntity<?> completeOrder(
            @PathVariable Long driverId,
            @PathVariable Long orderId) {
        try {
            DriverOrder order = driverService.completeOrder(driverId, orderId);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to complete order: " + e.getMessage());
        }
    }

    // CREATE TEST ORDER (for testing)
    @PostMapping("/create-test-order")
    public ResponseEntity<?> createTestOrder() {
        try {
            DriverOrder testOrder = driverOrderService.createTestOrder();
            return ResponseEntity.ok(testOrder);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    // VALIDATE TOKEN
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(
            @RequestParam String token,
            @RequestParam String email) {
        boolean isValid = driverService.validateToken(token, email);
        if (isValid) {
            return ResponseEntity.ok("Token is valid");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    // TEST ENDPOINT
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Driver API is working!");
    }
}



