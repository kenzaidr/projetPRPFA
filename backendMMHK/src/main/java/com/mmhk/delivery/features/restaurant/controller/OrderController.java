package com.mmhk.delivery.features.restaurant.controller;


import com.mmhk.delivery.features.restaurant.dto.OrderRequest;
import com.mmhk.delivery.features.restaurant.model.Order;
import com.mmhk.delivery.features.restaurant.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }


    @PostMapping("/create")
    public ResponseEntity<?> createOrder(
            @RequestBody OrderRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorization  // ← required = false
    ) {
        // Pour le test, utilisez un token par défaut
        String token = (authorization != null) ? authorization : "Bearer test-token";

        orderService.createOrder(request, token);
        return ResponseEntity.ok("Commande créée avec succès");
    }
    // 3. RÉCUPÉRER TOUTES LES COMMANDES
    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // 4. RÉCUPÉRER UNE COMMANDE PAR ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            Order order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.status(404).body("Commande non trouvée: " + e.getMessage());
        }
    }

    // 5. RÉCUPÉRER LES COMMANDES PAR RESTAURANT
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> getOrdersByRestaurant(@PathVariable Long restaurantId) {
        List<Order> orders = orderService.getOrdersByRestaurant(restaurantId);
        return ResponseEntity.ok(orders);
    }



}


