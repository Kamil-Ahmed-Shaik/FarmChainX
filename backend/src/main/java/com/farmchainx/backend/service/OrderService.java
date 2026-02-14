package com.farmchainx.backend.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.farmchainx.backend.dto.OrderRequestDTO;
import com.farmchainx.backend.entity.Crop;
import com.farmchainx.backend.entity.Order;
import com.farmchainx.backend.entity.OwnershipHistory;
import com.farmchainx.backend.entity.User;
import com.farmchainx.backend.repository.CropRepository;
import com.farmchainx.backend.repository.OrderRepository;
import com.farmchainx.backend.repository.OwnershipHistoryRepository;
import com.farmchainx.backend.repository.UserRepository;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private CropRepository cropRepo;
    @Autowired
    private OwnershipHistoryRepository trackRepo;
    @Autowired
    private BlockchainService blockchainService;
    @Autowired
    private UserRepository userRepo;

    public Order placeOrder(OrderRequestDTO dto) {

        Crop crop = cropRepo.findById(dto.getCropId())
                .orElseThrow();

        Order order = new Order();
        order.setCropId(dto.getCropId());
        order.setBuyerId(dto.getBuyerId());
        order.setSellerId(crop.getFarmerId());
        order.setStatus("PENDING");

        return orderRepo.save(order);
    }

    public Order acceptOrder(Long orderId) {

        Order order = orderRepo.findById(orderId).orElseThrow();
        User buyer = userRepo.findById(order.getBuyerId()).orElseThrow();
        Crop crop = cropRepo.findById(order.getCropId()).orElseThrow();

        // Logic Change: If buyer is DISTRIBUTOR, auto-complete
        if ("DISTRIBUTOR".equalsIgnoreCase(buyer.getRole())) {
            order.setStatus("DELIVERED");
            crop.setStatus("SOLD_OUT");
        } else {
            order.setStatus("ACCEPTED");
            crop.setStatus("IN_TRANSIT");
        }

        // Update Crop Ownership (Common for both flows)
        crop.setFarmerId(order.getBuyerId()); // crop.farmerId is essentially "currentOwnerId"
        cropRepo.save(crop);

        // Add Blockchain Transaction
        blockchainService.addTransactionBlock(crop);

        // Add History
        OwnershipHistory track = new OwnershipHistory();
        track.setCropId(crop.getId());
        track.setOwnerId(order.getBuyerId());
        track.setOwnerRole(buyer.getRole()); // Use buyer's actual role
        track.setUsername(buyer.getUsername());
        track.setTimestamp(LocalDateTime.now().toString());
        trackRepo.save(track);

        return orderRepo.save(order);
    }

    // Adding helper method for explicit distributor assignment if needed later
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepo.findById(orderId).orElseThrow();
        order.setStatus(status);
        return orderRepo.save(order);
    }
}
