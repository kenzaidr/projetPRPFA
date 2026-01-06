package com.mmhk.delivery.features.restaurant.repository;


import com.mmhk.delivery.features.restaurant.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByDriverId(Long driverId);
    List<Order> findByDriverIdAndOrderDateBetween(Long driverId, LocalDateTime start, LocalDateTime end);
}

