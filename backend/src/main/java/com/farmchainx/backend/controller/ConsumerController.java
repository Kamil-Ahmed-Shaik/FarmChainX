package com.farmchainx.backend.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmchainx.backend.dto.ConsumerOrderDTO;
import com.farmchainx.backend.dto.ConsumerOrderRequestDTO;
import com.farmchainx.backend.dto.ConsumerProfileDTO;
import com.farmchainx.backend.dto.DistributorCropInfo;
import com.farmchainx.backend.dto.DistributorListDTO;
import com.farmchainx.backend.dto.OwnershipLogDTO;
import com.farmchainx.backend.dto.ShipmentLogDTO;
import com.farmchainx.backend.entity.Consumer;
import com.farmchainx.backend.entity.Crop;
import com.farmchainx.backend.entity.Distributor;
import com.farmchainx.backend.entity.Farmer;
import com.farmchainx.backend.entity.Order;
import com.farmchainx.backend.entity.OwnershipHistory;
import com.farmchainx.backend.entity.Shipment;
import com.farmchainx.backend.entity.User;
import com.farmchainx.backend.repository.ConsumerRepository;
import com.farmchainx.backend.repository.CropRepository;
import com.farmchainx.backend.repository.DistributorRepository;
import com.farmchainx.backend.repository.FarmerRepository;
import com.farmchainx.backend.repository.OrderRepository;
import com.farmchainx.backend.repository.OwnershipHistoryRepository;
import com.farmchainx.backend.repository.ShipmentRepository;
import com.farmchainx.backend.repository.UserRepository;
import com.farmchainx.backend.repository.DisputeRepository;
import com.farmchainx.backend.repository.RetailerRepository;
import com.farmchainx.backend.entity.Dispute;

@RestController
@RequestMapping("/consumer")
public class ConsumerController {

    @Autowired
    private ConsumerRepository consumerRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private CropRepository cropRepo;
    @Autowired
    private FarmerRepository farmerRepo;
    @Autowired
    private DistributorRepository distributorRepo;
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private OwnershipHistoryRepository historyRepo;
    @Autowired
    private ShipmentRepository shipmentRepo;
    @Autowired
    private DisputeRepository disputeRepo;
    @Autowired
    private RetailerRepository retailerRepo;

    // ==================== PROFILE ENDPOINTS ====================

    @GetMapping("/{id}/profile")
    public ConsumerProfileDTO getProfile(@PathVariable Long id, Authentication auth) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(auth.getName())) {
            throw new AccessDeniedException("Not your profile");
        }

        Consumer c = consumerRepo.findById(id).orElse(new Consumer());
        if (c.getUserId() == null) {
            c.setUserId(id);
            consumerRepo.save(c);
        }

        ConsumerProfileDTO dto = new ConsumerProfileDTO();
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setBlocked(user.isBlocked());
        dto.setFullName(c.getFullName());
        dto.setAddress(c.getAddress());
        dto.setCity(c.getCity());
        dto.setState(c.getState());
        dto.setPincode(c.getPincode());
        dto.setMobile(c.getMobile());
        dto.setLatitude(c.getLatitude());
        dto.setLongitude(c.getLongitude());

        return dto;
    }

    @PostMapping("/{id}/profile")
    public ConsumerProfileDTO updateProfile(@PathVariable Long id, @RequestBody ConsumerProfileDTO dto,
            Authentication auth) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(auth.getName())) {
            throw new AccessDeniedException("Not your profile");
        }

        Consumer c = consumerRepo.findById(id).orElse(new Consumer());
        c.setUserId(id);
        c.setFullName(dto.getFullName());
        c.setAddress(dto.getAddress());
        c.setCity(dto.getCity());
        c.setState(dto.getState());
        c.setPincode(dto.getPincode());
        c.setMobile(dto.getMobile());
        c.setLatitude(dto.getLatitude());
        c.setLongitude(dto.getLongitude());

        consumerRepo.save(c);
        return dto;
    }

    // ==================== MARKETPLACE ENDPOINTS ====================

    @GetMapping("/marketplace/{consumerId}")
    public List<DistributorCropInfo> getMarketplaceCrops(@PathVariable Long consumerId) {
        // Get all verified crops from farmers
        List<Crop> list_crp = cropRepo.findByStatus("VERIFIED");

        // Filter out already ordered crops
        List<Order> myOrders = orderRepo.findByBuyerId(consumerId);
        List<Long> orderedCropIds = myOrders.stream()
                .map(Order::getCropId)
                .collect(Collectors.toList());

        List<Crop> filteredCrops = list_crp.stream()
                .filter(c -> !orderedCropIds.contains(c.getId()))
                .collect(Collectors.toList());

        List<DistributorCropInfo> result = new ArrayList<>();
        for (Crop cp : filteredCrops) {
            DistributorCropInfo temp = new DistributorCropInfo();
            temp.setId(cp.getId());
            temp.setFarmerId(cp.getFarmerId());
            temp.setCropName(cp.getCropName());
            temp.setQuantity(cp.getQuantity());
            temp.setHarvestDate(cp.getHarvestDate());
            temp.setPrice(cp.getPrice());
            temp.setQualityGrade(cp.getQualityGrade());
            temp.setCrop_status(cp.getStatus());
            temp.setBlockchainHash(cp.getBlockchainHash());
            temp.setLatitude(cp.getLatitude());
            temp.setLongitude(cp.getLongitude());
            temp.setImagePath(cp.getImagePath());

            Farmer temp_farmer = farmerRepo.findById(cp.getFarmerId()).orElse(new Farmer());
            temp.setCropType(temp_farmer.getCropType());
            temp.setLocation(temp_farmer.getLocation());
            temp.setMobile(temp_farmer.getMobile());
            temp.setAcres(temp_farmer.getAcres());
            temp.setSoil_type(temp_farmer.getSoil_type());
            temp.setFarmer_status(temp_farmer.getStatus());

            User usr = userRepo.findById(cp.getFarmerId()).orElse(new User());
            temp.setUsername(usr.getUsername());

            result.add(temp);
        }
        return result;
    }

    @GetMapping("/distributors")
    public List<DistributorListDTO> getAllDistributors() {
        List<Distributor> distributors = distributorRepo.findAll();
        List<DistributorListDTO> result = new ArrayList<>();
        for (Distributor d : distributors) {
            User user = userRepo.findById(d.getUserId()).orElse(null);
            if (user != null && !user.isBlocked()) {
                DistributorListDTO dto = new DistributorListDTO();
                dto.setDistributorId(d.getUserId());
                dto.setUsername(user.getUsername());
                dto.setCompanyName(d.getCompanyName());
                dto.setRegion(d.getRegion());
                result.add(dto);
            }
        }
        return result;
    }

    @PostMapping("/order")
    public String placeOrder(@RequestBody ConsumerOrderRequestDTO request) {
        // Get distributor name
        User distributorUser = userRepo.findById(request.getDistributorId()).orElse(null);
        String distributorName = distributorUser != null ? distributorUser.getUsername() : "";

        Order order = new Order();
        order.setCropId(request.getCropId());
        order.setSellerId(request.getFarmerId());
        order.setBuyerId(request.getConsumerId());
        order.setDistributorId(request.getDistributorId());
        order.setDistributorName(distributorName);
        order.setAddress(request.getAddress());
        order.setPhno(request.getPhone());
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());

        orderRepo.save(order);
        return "Order placed successfully";
    }

    // ==================== ORDER TRACKING ENDPOINTS ====================

    @PostMapping("/dispute")
    public String raiseDispute(@RequestBody Dispute dispute, Authentication auth) {
        User user = userRepo.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        dispute.setRaisedByUserId(user.getId());
        dispute.setRaisedByRole(user.getRole());
        dispute.setStatus("OPEN");
        dispute.setCreatedAt(LocalDateTime.now());

        disputeRepo.save(dispute);
        return "Dispute raised successfully";
    }

    @GetMapping("/orders/{consumerId}")
    public List<ConsumerOrderDTO> getConsumerOrders(@PathVariable Long consumerId) {
        List<Order> orders = orderRepo.findByBuyerId(consumerId);
        List<ConsumerOrderDTO> result = new ArrayList<>();

        for (Order ord : orders) {
            ConsumerOrderDTO dto = buildConsumerOrderDTO(ord);
            result.add(dto);
        }
        return result;
    }

    @GetMapping("/orders/{orderId}/details")
    public ConsumerOrderDTO getOrderDetails(@PathVariable Long orderId) {
        Order ord = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return buildConsumerOrderDTO(ord);
    }

    private ConsumerOrderDTO buildConsumerOrderDTO(Order ord) {
        ConsumerOrderDTO dto = new ConsumerOrderDTO();

        // Order details
        dto.setOrderId(ord.getId());
        dto.setOrderStatus(ord.getStatus());
        dto.setCreatedAt(ord.getCreatedAt());
        dto.setDeliveryAddress(ord.getAddress());
        dto.setDeliveryPhone(ord.getPhno());

        // Crop details
        Crop crop = cropRepo.findById(ord.getCropId()).orElse(null);
        if (crop != null) {
            dto.setCropId(crop.getId());
            dto.setCropName(crop.getCropName());
            dto.setQuantity(crop.getQuantity());
            dto.setPrice(crop.getPrice());
            dto.setQualityGrade(crop.getQualityGrade());
            dto.setHarvestDate(crop.getHarvestDate());
            dto.setImagePath(crop.getImagePath());
            dto.setBlockchainHash(crop.getBlockchainHash());
        }

        // Farmer details
        User farmerUser = userRepo.findById(ord.getSellerId()).orElse(null);
        Farmer farmer = farmerRepo.findById(ord.getSellerId()).orElse(null);
        if (farmerUser != null) {
            dto.setFarmerId(farmerUser.getId());
            dto.setFarmerUsername(farmerUser.getUsername());
        }
        if (farmer != null) {
            dto.setFarmName(farmer.getFarmName());
            dto.setFarmerMobile(farmer.getMobile());
            dto.setFarmLocation(farmer.getFarmLocation());
            dto.setFarmerLatitude(farmer.getLatitude());
            dto.setFarmerLongitude(farmer.getLongitude());
        }

        // Distributor details
        if (ord.getDistributorId() != null) {
            User distUser = userRepo.findById(ord.getDistributorId()).orElse(null);
            Distributor dist = distributorRepo.findById(ord.getDistributorId()).orElse(null);
            if (distUser != null) {
                dto.setDistributorId(distUser.getId());
                dto.setDistributorUsername(distUser.getUsername());
            }
            if (dist != null) {
                dto.setDistributorCompany(dist.getCompanyName());
                dto.setDistributorRegion(dist.getRegion());
            }
        }

        // Current ownership
        List<OwnershipHistory> ownershipList = historyRepo.findByCropId(ord.getCropId());
        if (!ownershipList.isEmpty()) {
            OwnershipHistory lastOwner = ownershipList.get(ownershipList.size() - 1);
            dto.setCurrentOwnerRole(lastOwner.getOwnerRole());
            dto.setCurrentOwnerName(lastOwner.getUsername());
        }

        // Ownership history
        List<OwnershipLogDTO> ownershipLogs = ownershipList.stream().map(oh -> {
            OwnershipLogDTO log = new OwnershipLogDTO();
            log.setId(oh.getId());
            log.setCropId(oh.getCropId());
            log.setOwnerRole(oh.getOwnerRole());
            log.setOwnerId(oh.getOwnerId());
            log.setUsername(oh.getUsername());
            log.setTimestamp(oh.getTimestamp());
            return log;
        }).collect(Collectors.toList());
        dto.setOwnershipHistory(ownershipLogs);

        // Shipment history
        List<Shipment> shipmentList = shipmentRepo.findByOrderId(ord.getId());
        List<ShipmentLogDTO> shipmentLogs = shipmentList.stream().map(sh -> {
            ShipmentLogDTO log = new ShipmentLogDTO();
            log.setId(sh.getId());
            log.setOrderId(sh.getOrderId());
            log.setLocation(sh.getLocation());
            log.setStatus(sh.getStatus());
            log.setConditionData(sh.getConditionData());
            log.setLatitude(sh.getLatitude());
            log.setLongitude(sh.getLongitude());
            log.setTimestamp(sh.getTimestamp());
            return log;
        }).collect(Collectors.toList());
        dto.setShipmentHistory(shipmentLogs);

        return dto;
    }

    @GetMapping("/dashboard/{consumerId}/stats")
    public java.util.Map<String, Object> getDashboardStats(@PathVariable Long consumerId) {
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        List<Order> orders = orderRepo.findByBuyerId(consumerId);

        // 1. Total Orders & Status Counts
        int totalOrders = orders.size();
        long delivered = orders.stream().filter(o -> "DELIVERED".equals(o.getStatus())).count();
        long pending = orders.stream().filter(o -> "PENDING".equals(o.getStatus()) || "ACCEPTED".equals(o.getStatus())
                || "IN_TRANSIT".equals(o.getStatus())).count();

        response.put("totalOrders", totalOrders);
        response.put("deliveredOrders", delivered);
        response.put("pendingOrders", pending);

        // 2. Success Rate
        double successRate = totalOrders > 0 ? ((double) delivered / totalOrders) * 100 : 0;
        response.put("successRate", String.format("%.1f", successRate));

        // 3. Distributors Used (Count unique distributors)
        long distributorsUsed = orders.stream()
                .map(Order::getDistributorId)
                .filter(java.util.Objects::nonNull)
                .distinct()
                .count();
        response.put("distributorsUsed", distributorsUsed);

        // 4. Retailers Near (Mock or simple logic: Total active retailers count for
        // now, as "near" needs complex geo query)
        // For now, let's just return total Retailers count as a proxy for "Market
        // Access"
        long retailersCount = retailerRepo.count();
        response.put("retailersAvailable", retailersCount);

        // 5. Graph Data: Orders by Status
        java.util.Map<String, Long> statusDistribution = orders.stream()
                .collect(Collectors.groupingBy(Order::getStatus, Collectors.counting()));
        response.put("statusDistribution", statusDistribution);

        // 6. Graph Data: Spending over time (by Month)
        // Note: Order entity doesn't strictly store price snapshot, we have to look up
        // Crop price.
        // This is an approximation if price changed, but acceptable for now.
        java.util.Map<String, Double> spendingOverTime = new java.util.HashMap<>();
        for (Order ord : orders) {
            Crop crop = cropRepo.findById(ord.getCropId()).orElse(null);
            if (crop != null) {
                double amount = crop.getPrice() * crop.getQuantity(); // Assuming full crop quantity ordered. Order
                                                                      // doesn't seem to have qty column separate from
                                                                      // Crop.
                String key = ord.getCreatedAt().getMonth().toString(); // Group by Month Name
                spendingOverTime.put(key, spendingOverTime.getOrDefault(key, 0.0) + amount);
            }
        }
        response.put("spendingOverTime", spendingOverTime);

        return response;
    }
}
