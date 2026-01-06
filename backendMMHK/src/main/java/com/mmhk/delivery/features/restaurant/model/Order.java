package com.mmhk.delivery.features.restaurant.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long restaurantId; // ⬅️ AJOUTEZ CE CHAMP!

    private Long driverId; // Driver assigned to this order

    @Column(nullable = false)
    private String deliveryAddress;

    @Column(nullable = false)
    private String phone;

    private String instructions;
    private String modePaiement;
    private String codePromo;

    @Column(nullable = false)
    private Double totalAmount;

    private String status;
    private LocalDateTime orderDate;

    // ---- Constructeur ----
    public Order() {
        this.orderDate = LocalDateTime.now();
        this.status = "PENDING";
    }

    // ---- AJOUTEZ CES GETTERS/SETTERS ----
    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    // ---- Autres getters/setters existants ----
    public Long getId() { return id; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public String getPhone() { return phone; }
    public String getInstructions() { return instructions; }
    public String getModePaiement() { return modePaiement; }
    public String getCodePromo() { return codePromo; }
    public Double getTotalAmount() { return totalAmount; }
    public String getStatus() { return status; }
    public LocalDateTime getOrderDate() { return orderDate; }

    public void setId(Long id) { this.id = id; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }
    public void setCodePromo(String codePromo) { this.codePromo = codePromo; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public void setStatus(String status) { this.status = status; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
}