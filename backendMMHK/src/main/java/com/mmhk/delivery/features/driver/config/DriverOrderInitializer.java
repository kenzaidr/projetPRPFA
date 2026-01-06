package com.mmhk.delivery.features.driver.config;

import com.mmhk.delivery.features.driver.model.DriverOrder;
import com.mmhk.delivery.features.driver.repository.DriverOrderRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DriverOrderInitializer {

    @Autowired
    private DriverOrderRepository driverOrderRepository;

    @PostConstruct
    public void init() {
        // Check if there are any pending orders without a driver
        long pendingOrdersCount = driverOrderRepository.findByStatusAndDriverIdIsNull("PENDING").size();
        
        if (pendingOrdersCount == 0) {
            // Create a test order if none exists
            System.out.println("No pending driver orders found. Creating test order...");
            DriverOrder testOrder = new DriverOrder();
            testOrder.setUserId(1L);
            testOrder.setDriverId(null);
            testOrder.setPickupAddress("Fes Train Station, Fes"); // Where driver picks up the user
            testOrder.setDeliveryAddress("Fes Medina, Fes"); // Where driver takes the user
            testOrder.setPhone("+212612345678");
            testOrder.setTotalAmount(125.50);
            testOrder.setStatus("PENDING");
            testOrder.setInstructions("Please ring the doorbell");
            testOrder.setModePaiement("CASH");
            
            driverOrderRepository.save(testOrder);
            System.out.println("✅ Test driver order created successfully!");
        } else {
            System.out.println("✅ Found " + pendingOrdersCount + " pending driver order(s)");
        }
    }
}

