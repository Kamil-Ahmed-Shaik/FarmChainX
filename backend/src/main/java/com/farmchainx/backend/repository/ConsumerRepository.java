package com.farmchainx.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.farmchainx.backend.entity.Consumer;

public interface ConsumerRepository extends JpaRepository<Consumer, Long> {
}
