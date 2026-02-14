package com.farmchainx.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.farmchainx.backend.entity.Report;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByType(String type);
}
