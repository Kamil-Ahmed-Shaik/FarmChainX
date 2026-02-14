package com.farmchainx.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farmchainx.backend.entity.Retailer;

public interface RetailerRepository extends JpaRepository<Retailer, Long> {
}
