package com.farmchainx.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farmchainx.backend.entity.Dispute;
import java.util.List;

public interface DisputeRepository extends JpaRepository<Dispute, Long> {
    List<Dispute> findByStatus(String status);

    List<Dispute> findByRaisedByUserId(Long userId);

    List<Dispute> findByOrderId(Long orderId);
}
