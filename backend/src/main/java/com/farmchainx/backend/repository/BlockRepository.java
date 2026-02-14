package com.farmchainx.backend.repository;

import com.farmchainx.backend.entity.Block;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface BlockRepository extends JpaRepository<Block, Long> {
    Optional<Block> findTopByOrderByIdDesc();
}
