package com.mmhk.delivery.features.driver.repository;

import com.mmhk.delivery.features.driver.model.DriverOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverOrderRepository extends JpaRepository<DriverOrder, Long> {
    List<DriverOrder> findByDriverId(Long driverId);
    List<DriverOrder> findByStatusAndDriverIdIsNull(String status);
    List<DriverOrder> findByStatus(String status);
}

