package com.farmchainx.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farmchainx.backend.entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
}
