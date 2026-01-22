package com.farmchainx.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farmchainx.backend.entity.OwnershipHistory;
import java.util.List;

public interface OwnershipHistoryRepository extends JpaRepository<OwnershipHistory, Long> {
    List<OwnershipHistory> findByCropId(Long cropId);
}
