package com.farmchainx.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmchainx.backend.entity.Shipment;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findByOrderId(Long orderId);

    // Count shipments for determining tab category
    long countByOrderId(Long orderId);
}
