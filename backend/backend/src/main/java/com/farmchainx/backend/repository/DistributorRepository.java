package com.farmchainx.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farmchainx.backend.entity.Distributor;

public interface DistributorRepository extends JpaRepository<Distributor, Long> {
}
