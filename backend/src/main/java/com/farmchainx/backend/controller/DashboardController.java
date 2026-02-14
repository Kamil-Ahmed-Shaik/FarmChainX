package com.farmchainx.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    @GetMapping("/farmer/dashboard")
    public String farmerDashboard() {
        return "Farmer Dashboard";
    }

    @GetMapping("/distributor/dashboard")
    public String distributorDashboard() {
        return "Distributor Dashboard";
    }

    @GetMapping("/retailer/dashboard")
    public String retailerDashboard() {
        return "Retailer Dashboard";
    }

    @GetMapping("/admin/dashboard")
        public String adminDashboard() {
        return "Admin Dashboard";
    }
}
