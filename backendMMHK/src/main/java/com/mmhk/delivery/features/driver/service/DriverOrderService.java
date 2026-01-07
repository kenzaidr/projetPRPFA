package com.mmhk.delivery.features.driver.service;

import com.mmhk.delivery.features.driver.model.DriverOrder;
import com.mmhk.delivery.features.driver.model.Driver;
import com.mmhk.delivery.features.driver.repository.DriverOrderRepository;
import com.mmhk.delivery.features.driver.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverOrderService {

    @Autowired
    private DriverOrderRepository driverOrderRepository;

    @Autowired
    private DriverRepository driverRepository;

    // GET AVAILABLE ORDERS (pending orders without a driver)
    public List<DriverOrder> getAvailableOrders() {
        List<DriverOrder> orders = driverOrderRepository.findByStatusAndDriverIdIsNull("PENDING");
        System.out.println("Available driver orders found: " + orders.size());
        return orders;
    }

    // GET DRIVER ORDERS (orders assigned to this driver)
    public List<DriverOrder> getDriverOrders(Long driverId) {
        return driverOrderRepository.findByDriverId(driverId);
    }

    // ACCEPT ORDER (assign driver to order)
    public DriverOrder acceptOrder(Long driverId, Long orderId) {
        // Verify driver exists and is online
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        
        if (!driver.getIsOnline()) {
            throw new RuntimeException("Driver must be online to accept orders");
        }

        // Find the order
        DriverOrder order = driverOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Check if order is already assigned
        if (order.getDriverId() != null && !order.getDriverId().equals(driverId)) {
            throw new RuntimeException("Order is already assigned to another driver");
        }

        // Check if order status is PENDING
        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Order is not available for acceptance");
        }

        // Ensure pickup address is set (fallback if missing)
        if (order.getPickupAddress() == null || order.getPickupAddress().trim().isEmpty()) {
            order.setPickupAddress("Fes Train Station, Fes");
            System.out.println("Warning: Pickup address was missing, set to default");
        }

        // Assign driver to order and update status
        order.setDriverId(driverId);
        order.setStatus("ACCEPTED");
        DriverOrder savedOrder = driverOrderRepository.save(order);
        
        System.out.println("Order accepted - Pickup: " + savedOrder.getPickupAddress() + ", Delivery: " + savedOrder.getDeliveryAddress());

        // Update driver's total rides count
        driver.setTotalRides(driver.getTotalRides() != null ? driver.getTotalRides() + 1 : 1);
        driverRepository.save(driver);

        return savedOrder;
    }

    // COMPLETE ORDER (mark order as completed)
    public DriverOrder completeOrder(Long driverId, Long orderId) {
        // Verify driver exists
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        // Find the order
        DriverOrder order = driverOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Check if order is assigned to this driver
        if (order.getDriverId() == null || !order.getDriverId().equals(driverId)) {
            throw new RuntimeException("Order is not assigned to this driver");
        }

        // Check if order status is ACCEPTED
        if (!"ACCEPTED".equals(order.getStatus())) {
            throw new RuntimeException("Order cannot be completed. Current status: " + order.getStatus());
        }

        // Update status to COMPLETED
        order.setStatus("COMPLETED");
        DriverOrder savedOrder = driverOrderRepository.save(order);
        
        System.out.println("Order completed - Order ID: " + savedOrder.getId());

        return savedOrder;
    }

    // CREATE TEST ORDER (for testing)
    public DriverOrder createTestOrder() {
        DriverOrder testOrder = new DriverOrder();
        testOrder.setUserId(1L); // Set user ID (customer who placed the order)
        testOrder.setDriverId(null); // No driver assigned yet
        testOrder.setPickupAddress("Fes Train Station, Fes"); // Where driver picks up the user
        testOrder.setDeliveryAddress("Fes Medina, Fes"); // Where driver takes the user
        testOrder.setPhone("+212612345678");
        testOrder.setTotalAmount(125.50);
        testOrder.setStatus("PENDING");
        testOrder.setInstructions("Please ring the doorbell");
        testOrder.setModePaiement("CASH");
        
        return driverOrderRepository.save(testOrder);
    }
}

