package com.mmhk.delivery.features.restaurant.service;

import com.mmhk.delivery.features.restaurant.dto.OrderRequest;
import com.mmhk.delivery.features.restaurant.model.Order;
import com.mmhk.delivery.features.restaurant.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // POST - CRÉER COMMANDE (votre code existant)
    @Transactional
    public void createOrder(OrderRequest dto, String authHeader) {
        try {
            System.out.println("🛠️ OrderService.createOrder() START");
            System.out.println("DTO received: " + dto);

            // Validation
            if (dto.getRestaurantId() == null) {
                throw new IllegalArgumentException("restaurantId est obligatoire");
            }
            if (dto.getDeliveryAddress() == null || dto.getDeliveryAddress().trim().isEmpty()) {
                throw new IllegalArgumentException("deliveryAddress est obligatoire");
            }
            if (dto.getPhone() == null || dto.getPhone().trim().isEmpty()) {
                throw new IllegalArgumentException("phone est obligatoire");
            }
            if (dto.getTotalAmount() == null || dto.getTotalAmount() <= 0) {
                throw new IllegalArgumentException("totalAmount doit être positif");
            }
            if (dto.getModePaiement() == null || dto.getModePaiement().trim().isEmpty()) {
                throw new IllegalArgumentException("modePaiement est obligatoire");
            }

            // Log
            System.out.println("✅ Validation passed:");
            System.out.println("  - restaurantId: " + dto.getRestaurantId());
            System.out.println("  - deliveryAddress: " + dto.getDeliveryAddress());
            System.out.println("  - phone: " + dto.getPhone());
            System.out.println("  - totalAmount: " + dto.getTotalAmount());

            // Création
            Order order = new Order();
            order.setRestaurantId(dto.getRestaurantId());
            order.setDeliveryAddress(dto.getDeliveryAddress());
            order.setTotalAmount(dto.getTotalAmount());
            order.setStatus("PENDING");
            order.setOrderDate(LocalDateTime.now());
            order.setPhone(dto.getPhone());
            order.setInstructions(dto.getInstructions() != null ? dto.getInstructions() : "");
            order.setModePaiement(dto.getModePaiement());
            order.setCodePromo(dto.getCodePromo());

            // Sauvegarde
            Order savedOrder = orderRepository.save(order);
            System.out.println("✅ Order saved with ID: " + savedOrder.getId());

        } catch (Exception e) {
            System.err.println("🔥 ERROR in OrderService.createOrder():");
            e.printStackTrace();
            throw new RuntimeException("Erreur lors de la création de la commande: " + e.getMessage(), e);
        }
    }

    // GET - TOUTES LES COMMANDES
    public List<Order> getAllOrders() {
        try {
            List<Order> orders = orderRepository.findAll();
            System.out.println("📋 getAllOrders: " + orders.size() + " commandes trouvées");
            return orders;
        } catch (Exception e) {
            System.err.println("❌ ERROR in getAllOrders: " + e.getMessage());
            throw new RuntimeException("Erreur lors de la récupération des commandes", e);
        }
    }

    // GET - COMMANDE PAR ID
    public Order getOrderById(Long id) {
        try {
            System.out.println("🔍 getOrderById: recherche ID " + id);
            Order order = orderRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Commande non trouvée avec ID: " + id));
            System.out.println("✅ Commande trouvée: ID=" + order.getId());
            return order;
        } catch (Exception e) {
            System.err.println("❌ ERROR in getOrderById: " + e.getMessage());
            throw e;
        }
    }

    // GET - COMMANDES PAR RESTAURANT
    public List<Order> getOrdersByRestaurant(Long restaurantId) {
        try {
            System.out.println("🏪 getOrdersByRestaurant: recherche restaurant " + restaurantId);

            // Méthode 1: Si findByRestaurantId existe dans le repository
            // return orderRepository.findByRestaurantId(restaurantId);

            // Méthode 2: Sinon, filtrez manuellement
            List<Order> allOrders = orderRepository.findAll();
            List<Order> filtered = allOrders.stream()
                    .filter(order -> order.getRestaurantId() != null && order.getRestaurantId().equals(restaurantId))
                    .toList();

            System.out.println("✅ " + filtered.size() + " commandes trouvées pour restaurant " + restaurantId);
            return filtered;

        } catch (Exception e) {
            System.err.println("❌ ERROR in getOrdersByRestaurant: " + e.getMessage());
            throw new RuntimeException("Erreur lors de la récupération des commandes du restaurant", e);
        }
    }
}