package com.farmchainx.backend.controller;

import com.farmchainx.backend.entity.Block;
import com.farmchainx.backend.entity.Crop;
import com.farmchainx.backend.entity.Order;
import com.farmchainx.backend.entity.User;
import com.farmchainx.backend.repository.CropRepository;
import com.farmchainx.backend.repository.OrderRepository;
import com.farmchainx.backend.repository.UserRepository;
import com.farmchainx.backend.service.BlockchainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private CropRepository cropRepo;
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private BlockchainService blockchainService;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCrops", cropRepo.count());
        stats.put("totalOrders", orderRepo.count());
        stats.put("totalUsers", userRepo.count());
        stats.put("blockchainLength", blockchainService.getAllBlocks().size());
        return stats;
    }

    @GetMapping("/blockchain")
    public List<Block> getBlockchain() {
        return blockchainService.getAllBlocks();
    }

    @GetMapping("/farmer/{farmerId}/income")
    public Map<String, Object> getFarmerIncomeStats(@PathVariable Long farmerId,
            @org.springframework.web.bind.annotation.RequestParam(required = false, defaultValue = "MONTHS") String period) {
        List<Order> orders = orderRepo.findBySellerId(farmerId);

        // Calculate total income
        double totalIncome = 0;
        Map<String, Double> incomeMap = new HashMap<>();

        for (Order order : orders) {
            // Assuming order fulfilled/delivered contributes to income
            if ("DELIVERED".equals(order.getStatus()) || "ACCEPTED".equals(order.getStatus())
                    || "SOLD_OUT".equals(order.getStatus())) {
                Crop crop = cropRepo.findById(order.getCropId()).orElse(null);
                if (crop != null) {
                    double income = crop.getPrice() * crop.getQuantity(); // approx calculation
                    totalIncome += income;

                    String key = "";
                    if ("DAYS".equalsIgnoreCase(period)) {
                        key = order.getCreatedAt().toLocalDate().toString(); // YYYY-MM-DD
                    } else if ("YEARS".equalsIgnoreCase(period)) {
                        key = String.valueOf(order.getCreatedAt().getYear());
                    } else { // MONTHS (Default)
                        key = order.getCreatedAt().getMonth().toString();
                    }

                    incomeMap.put(key, incomeMap.getOrDefault(key, 0.0) + income);
                }
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("totalIncome", totalIncome);
        response.put("monthlyIncome", incomeMap); // Keeping key name compatible with frontend for now, but content
                                                  // varies
        return response;
    }

    @GetMapping("/admin/users")
    public Map<String, Long> getUserStats() {
        List<User> users = userRepo.findAll();
        Map<String, Long> stats = users.stream()
                .collect(Collectors.groupingBy(User::getRole, Collectors.counting()));
        return stats;
    }

    @GetMapping("/crops/trends")
    public Map<String, Object> getCropTrends() {
        List<Crop> crops = cropRepo.findAll();
        Map<String, Long> cropCounts = crops.stream()
                .collect(Collectors.groupingBy(Crop::getCropName, Collectors.counting()));

        Map<String, Double> avgPrices = crops.stream()
                .filter(c -> c.getPrice() != null)
                .collect(Collectors.groupingBy(Crop::getCropName, Collectors.averagingDouble(Crop::getPrice)));

        Map<String, Object> response = new HashMap<>();
        response.put("counts", cropCounts);
        response.put("avgPrices", avgPrices);
        return response;
    }
}
