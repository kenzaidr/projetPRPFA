package com.mmhk.delivery.features.restaurant.dto;

import java.util.List;
import java.util.ArrayList;

public class OrderRequest {
    // Champs OBLIGATOIRES pour votre frontend
    private Long restaurantId;
    private List<OrderItemRequest> items = new ArrayList<>();

    // Champs existants
    private String deliveryAddress;
    private String phone;
    private Double totalAmount;
    private String instructions;
    private String modePaiement;
    private String codePromo;

    // Getters et setters pour TOUS
    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getModePaiement() { return modePaiement; }
    public void setModePaiement(String modePaiement) { this.modePaiement = modePaiement; }

    public String getCodePromo() { return codePromo; }
    public void setCodePromo(String codePromo) { this.codePromo = codePromo; }
}