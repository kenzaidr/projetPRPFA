package com.mmhk.delivery.features.restaurant.repository;


import com.mmhk.delivery.features.restaurant.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
public interface OrderRepository extends JpaRepository<Order, Long> {
}

