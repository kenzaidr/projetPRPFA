package com.mmhk.delivery.features.restaurant.service;

import com.mmhk.delivery.features.restaurant.dto.OrderItemRequest;
import com.mmhk.delivery.features.restaurant.dto.OrderRequest;
import com.mmhk.delivery.features.restaurant.model.Order;
import com.mmhk.delivery.features.restaurant.repository.OrderRepository;
import com.mmhk.delivery.features.restaurant.repository.RestaurantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final RestaurantRepository restaurantRepository; // ⬅️ AJOUTEZ

    public OrderService(OrderRepository orderRepository, RestaurantRepository restaurantRepository) {
        this.orderRepository = orderRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @Transactional
    public void createOrder(OrderRequest dto, String authHeader) {
        try {
            System.out.println("🛠️ OrderService.createOrder() START");

            // Afficher TOUS les champs
            System.out.println("=== DTO REÇU ===");
            System.out.println("restaurantId: " + dto.getRestaurantId());
            System.out.println("deliveryAddress: " + dto.getDeliveryAddress());
            System.out.println("phone: " + dto.getPhone());
            System.out.println("modePaiement: " + dto.getModePaiement());
            System.out.println("codePromo: " + dto.getCodePromo());
            System.out.println("instructions: " + dto.getInstructions());
            System.out.println("totalAmount: " + dto.getTotalAmount());

            // Afficher les items
            System.out.println("Items (" + dto.getItems().size() + "):");
            for (OrderItemRequest item : dto.getItems()) {
                System.out.println("  - menuItemId: " + item.getMenuItemId() +
                        ", quantity: " + item.getQuantity());
            }
            System.out.println("================");

            // ✅ AJOUTEZ CETTE VÉRIFICATION IMPORTANTE
            if (dto.getRestaurantId() == null) {
                throw new IllegalArgumentException("restaurantId est obligatoire");
            }

            // ✅ VÉRIFIEZ QUE LE RESTAURANT EXISTE
            System.out.println("🔍 Vérification du restaurant ID: " + dto.getRestaurantId());
            boolean restaurantExists = restaurantRepository.existsById(dto.getRestaurantId());
            System.out.println("🔍 Restaurant existe ? " + restaurantExists);

            if (!restaurantExists) {
                throw new IllegalArgumentException("Restaurant non trouvé avec ID: " + dto.getRestaurantId() +
                        ". Vérifiez que le restaurant existe dans la base de données.");
            }

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