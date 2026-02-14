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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.Map;

import com.farmchainx.backend.dto.DistributorCropInfo;
import com.farmchainx.backend.dto.DistributorInventoryDTO;
import com.farmchainx.backend.dto.DistributorOrderResponseDTO;
import com.farmchainx.backend.dto.DistributorProfileDTO;
import com.farmchainx.backend.dto.OwnershipLogDTO;
import com.farmchainx.backend.dto.ShipmentLogDTO;
import com.farmchainx.backend.dto.ShipmentUpdateDTO;
import com.farmchainx.backend.entity.Crop;
import com.farmchainx.backend.entity.Distributor;
import com.farmchainx.backend.entity.Farmer;
import com.farmchainx.backend.entity.Order;
import com.farmchainx.backend.entity.OwnershipHistory;
import com.farmchainx.backend.entity.Retailer;
import com.farmchainx.backend.entity.Shipment;
import com.farmchainx.backend.entity.User;
import com.farmchainx.backend.repository.CropRepository;
import com.farmchainx.backend.repository.DistributorRepository;
import com.farmchainx.backend.repository.FarmerRepository;
import com.farmchainx.backend.repository.OrderRepository;
import com.farmchainx.backend.repository.OwnershipHistoryRepository;
import com.farmchainx.backend.repository.RetailerRepository;
import com.farmchainx.backend.repository.ShipmentRepository;
import com.farmchainx.backend.repository.UserRepository;
import com.farmchainx.backend.service.BlockchainService;

@RestController
@RequestMapping("/distributor")
public class DistributorController {

    @Autowired
    private CropRepository cropRepo;
    @Autowired
    private FarmerRepository farmerRepo;
    @Autowired
    private DistributorRepository distributorRepo;
    @Autowired
    private BlockchainService blockchainService;
    @Autowired
    private OwnershipHistoryRepository historyRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private ShipmentRepository shipmentRepo;
    @Autowired
    private RetailerRepository retailerRepo;

    @GetMapping("/{id}/profile")
    public DistributorProfileDTO getProfile(@PathVariable Long id, Authentication auth) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(auth.getName())) {
            throw new AccessDeniedException("Not your profile");
        }

        Distributor d = distributorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Distributor not found"));

        DistributorProfileDTO dto = new DistributorProfileDTO();
        dto.setCompanyName(d.getCompanyName());
        dto.setRegion(d.getRegion());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setBlock(user.isBlocked());
        dto.setLatitude(d.getLatitude());
        dto.setLongitude(d.getLongitude());

        return dto;
    }

    @PostMapping("/{id}/profile")
    public DistributorProfileDTO updateProfile(@PathVariable Long id,
            @RequestBody DistributorProfileDTO dto,
            Authentication auth) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(auth.getName())) {
            throw new AccessDeniedException("Not your profile");
        }

        Distributor d = distributorRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Distributor not found"));

        d.setLatitude(dto.getLatitude());
        d.setLongitude(dto.getLongitude());
        d.setCompanyName(dto.getCompanyName());
        d.setRegion(dto.getRegion());

        distributorRepo.save(d);
        return dto;
    }

    @PostMapping("/transfer/{cropId}/{distributorId}")
    public String transferCrop(@PathVariable Long cropId,
            @PathVariable Long distributorId) {

        String role = "DISTRIBUTOR";
        Crop crp = cropRepo.findById(cropId).orElse(null);
        if (crp != null)
            blockchainService.addTransactionBlock(crp);

        OwnershipHistory history = new OwnershipHistory();
        User user = userRepo.findById(distributorId).orElseThrow();
        history.setCropId(cropId);
        history.setOwnerRole(role);
        history.setOwnerId(distributorId);
        history.setUsername(user.getUsername());
        history.setTimestamp(LocalDateTime.now().toString());

        historyRepo.save(history);
        return "Crop ownership transferred to Distributor successfully";
    }

    @GetMapping("/market/{distributorId}")
    public List<DistributorCropInfo> getallcrops(@PathVariable Long distributorId) {
        List<Crop> list_crp = cropRepo.findByStatus("VERIFIED");

        // Filter out crops already ordered by this distributor
        List<Order> myOrders = orderRepo.findByBuyerId(distributorId);
        List<Long> orderedCropIds = myOrders.stream()
                .map(Order::getCropId)
                .collect(Collectors.toList());

        List<DistributorCropInfo> result = new ArrayList<>();
        for (Crop cp : list_crp) {
            // Skip if crop already ordered
            if (orderedCropIds.contains(cp.getId())) {
                continue;
            }

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
            Farmer temp_farmer = farmerRepo.getReferenceById(cp.getFarmerId());
            temp.setCropType(temp_farmer.getCropType());
            temp.setLocation(temp_farmer.getLocation());
            temp.setMobile(temp_farmer.getMobile());
            temp.setAcres(temp_farmer.getAcres());
            temp.setSoil_type(temp_farmer.getSoil_type());
            temp.setFarmer_status(temp_farmer.getStatus());
            User usr = userRepo.getReferenceById(cp.getFarmerId());
            temp.setUsername(usr.getUsername());
            result.add(temp);
        }

        return result;
    }

    @PostMapping("/order")
    public String placeOrderJSON(@RequestBody com.farmchainx.backend.dto.ConsumerOrderRequestDTO request) {
        Order ord = new Order();
        ord.setCropId(request.getCropId());
        ord.setSellerId(request.getFarmerId());
        ord.setBuyerId(request.getDistributorId()); // Distributor is the buyer
        ord.setAddress(request.getAddress());
        ord.setPhno(request.getPhone());
        ord.setStatus("PENDING");
        ord.setCreatedAt(LocalDateTime.now());
        orderRepo.save(ord);

        return "Order placed successfully. Waiting for farmer approval.";
    }

    @PostMapping("/buy/{cropId}/{distributorId}/{farmerId}")
    public String order_placed(@PathVariable Long cropId, @PathVariable Long distributorId,
            @PathVariable Long farmerId) {
        Order ord = new Order();
        ord.setCropId(cropId);
        ord.setSellerId(farmerId);
        ord.setBuyerId(distributorId);
        ord.setStatus("PENDING");
        ord.setCreatedAt(LocalDateTime.now());
        orderRepo.save(ord);

        return "Order placed successfully. Waiting for farmer approval.";
    }

    @GetMapping("/myorders/{distributorId}")
    public List<DistributorOrderResponseDTO> myorders(@PathVariable Long distributorId) {
        List<DistributorOrderResponseDTO> result = new ArrayList<>();
        List<Order> my_orders = orderRepo.findByBuyerId(distributorId);
        for (Order ord : my_orders) {
            DistributorOrderResponseDTO temp = new DistributorOrderResponseDTO();
            Crop c = cropRepo.getReferenceById(ord.getCropId());
            Farmer temp_farmer = farmerRepo.getReferenceById(ord.getSellerId());
            User usr = userRepo.getReferenceById(ord.getSellerId());
            temp.setId(ord.getId());
            temp.setCropId(ord.getCropId());
            temp.setStatus(ord.getStatus());
            temp.setBuyerId(distributorId);
            temp.setCreatedAt(ord.getCreatedAt());

            temp.setFarmerId(c.getFarmerId());
            temp.setQualityGrade(c.getQualityGrade());
            temp.setHarvestDate(c.getHarvestDate());
            temp.setPrice(c.getPrice());
            temp.setQuantity(c.getQuantity());
            temp.setCrop_status(c.getStatus());
            temp.setBlockchainHash(c.getBlockchainHash());
            temp.setLatitude(c.getLatitude());
            temp.setLongitude(c.getLongitude());
            temp.setImagePath(c.getImagePath());
            temp.setCropName(c.getCropName());

            temp.setFarmName(temp_farmer.getFarmName());
            temp.setCropType(temp_farmer.getCropType());
            temp.setMobile(temp_farmer.getMobile());
            temp.setAcres(temp_farmer.getAcres());
            temp.setFarmer_status(temp_farmer.getStatus());
            temp.setUsername(usr.getUsername());

            result.add(temp);
        }
        return result;
    }

    // ==================== INVENTORY MANAGEMENT ENDPOINTS ====================

    @GetMapping("/inventory/{distributorId}")
    public List<DistributorInventoryDTO> getInventory(@PathVariable Long distributorId) {
        List<DistributorInventoryDTO> result = new ArrayList<>();

        // Get ACCEPTED orders (Received tab)
        List<Order> received = orderRepo.findAcceptedByDistributorId(distributorId);
        for (Order ord : received) {
            DistributorInventoryDTO dto = buildInventoryDTO(ord, "RECEIVED");
            result.add(dto);
        }

        // Get IN_TRANSIT orders
        List<Order> inTransit = orderRepo.findInTransitByDistributorId(distributorId);
        for (Order ord : inTransit) {
            DistributorInventoryDTO dto = buildInventoryDTO(ord, "IN_TRANSIT");
            result.add(dto);
        }

        // Get DELIVERED orders
        List<Order> delivered = orderRepo.findDeliveredByDistributorId(distributorId);
        for (Order ord : delivered) {
            DistributorInventoryDTO dto = buildInventoryDTO(ord, "DELIVERED");
            result.add(dto);
        }

        return result;
    }

    @GetMapping("/inventory/{distributorId}/received")
    public List<DistributorInventoryDTO> getReceivedOrders(@PathVariable Long distributorId) {
        List<Order> orders = orderRepo.findAcceptedByDistributorId(distributorId);
        return orders.stream().map(ord -> buildInventoryDTO(ord, "RECEIVED")).collect(Collectors.toList());
    }

    @GetMapping("/inventory/{distributorId}/transit")
    public List<DistributorInventoryDTO> getInTransitOrders(@PathVariable Long distributorId) {
        List<Order> orders = orderRepo.findInTransitByDistributorId(distributorId);
        return orders.stream().map(ord -> buildInventoryDTO(ord, "IN_TRANSIT")).collect(Collectors.toList());
    }

    @GetMapping("/inventory/{distributorId}/delivered")
    public List<DistributorInventoryDTO> getDeliveredOrders(@PathVariable Long distributorId) {
        List<Order> orders = orderRepo.findDeliveredByDistributorId(distributorId);
        return orders.stream().map(ord -> buildInventoryDTO(ord, "DELIVERED")).collect(Collectors.toList());
    }

    private DistributorInventoryDTO buildInventoryDTO(Order ord, String tabCategory) {
        DistributorInventoryDTO dto = new DistributorInventoryDTO();

        // Order details
        dto.setOrderId(ord.getId());
        dto.setOrderStatus(ord.getStatus());
        dto.setCreatedAt(ord.getCreatedAt());
        dto.setDeliveryAddress(ord.getAddress());
        dto.setDeliveryPhone(ord.getPhno());
        dto.setTabCategory(tabCategory);

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

        // Retailer details
        User retailerUser = userRepo.findById(ord.getBuyerId()).orElse(null);
        Retailer retailer = retailerRepo.findById(ord.getBuyerId()).orElse(null);
        if (retailerUser != null) {
            dto.setRetailerId(retailerUser.getId());
            dto.setRetailerUsername(retailerUser.getUsername());
        }
        if (retailer != null) {
            dto.setRetailerShopName(retailer.getShopName());
            dto.setRetailerLocation(retailer.getLocation());
            dto.setRetailerLatitude(retailer.getLatitude());
            dto.setRetailerLongitude(retailer.getLongitude());
        }

        // Shipment count
        long shipmentCount = shipmentRepo.countByOrderId(ord.getId());
        dto.setShipmentCount((int) shipmentCount);

        // Ownership history
        List<OwnershipHistory> ownershipList = historyRepo.findByCropId(ord.getCropId());
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

    // ==================== SHIPMENT MANAGEMENT ENDPOINTS ====================

    @PostMapping("/shipment/{orderId}")
    public String addShipmentLog(@PathVariable Long orderId, @RequestBody ShipmentUpdateDTO shipmentDTO) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Shipment shipment = new Shipment();
        shipment.setOrderId(orderId);
        shipment.setLocation(shipmentDTO.getLocation());
        shipment.setStatus(shipmentDTO.getStatus());
        shipment.setConditionData(shipmentDTO.getConditionData());
        shipment.setLatitude(shipmentDTO.getLatitude());
        shipment.setLongitude(shipmentDTO.getLongitude());
        shipment.setTimestamp(LocalDateTime.now());

        shipmentRepo.save(shipment);

        // Update order status to IN_TRANSIT if not already
        if ("ACCEPTED".equals(order.getStatus())) {
            order.setStatus("IN_TRANSIT");
            orderRepo.save(order);
        }

        return "Shipment log added successfully";
    }

    @PutMapping("/deliver/{orderId}")
    public String markAsDelivered(@PathVariable Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Update order status
        order.setStatus("DELIVERED");
        orderRepo.save(order);

        // Transfer ownership to retailer
        User retailerUser = userRepo.findById(order.getBuyerId()).orElseThrow();

        OwnershipHistory history = new OwnershipHistory();
        history.setCropId(order.getCropId());
        history.setOwnerRole("RETAILER");
        history.setOwnerId(order.getBuyerId());
        history.setUsername(retailerUser.getUsername());
        history.setTimestamp(LocalDateTime.now().toString());
        historyRepo.save(history);

        // Add blockchain transaction
        Crop crop = cropRepo.findById(order.getCropId()).orElse(null);
        if (crop != null) {
            blockchainService.addTransactionBlock(crop);
        }

        // Add final shipment log
        Shipment shipment = new Shipment();
        shipment.setOrderId(orderId);
        shipment.setLocation("Delivered to " + retailerUser.getUsername());
        shipment.setStatus("DELIVERED");
        shipment.setTimestamp(LocalDateTime.now());
        shipmentRepo.save(shipment);

        return "Order marked as delivered. Ownership transferred to retailer.";
    }

    @GetMapping("/dashboard/{distributorId}/stats")
    public Map<String, Object> getDashboardStats(@PathVariable Long distributorId,
            @RequestParam(required = false, defaultValue = "ALL") String timeFilter) {
        Map<String, Object> stats = new HashMap<>();

        // 1. Active Deliveries (IN_TRANSIT)
        List<Order> inTransit = orderRepo.findInTransitByDistributorId(distributorId);
        stats.put("activeDeliveries", inTransit.size());

        // 2. Orders Received (ACCEPTED) & Delivered (DELIVERED)
        // We might want to filter these by timeFilter (e.g., this month, this year)
        List<Order> received = orderRepo.findAcceptedByDistributorId(distributorId);
        List<Order> delivered = orderRepo.findDeliveredByDistributorId(distributorId);

        // Filter functionality can be added here based on 'createdAt'
        // For now returning totals
        stats.put("ordersReceived", received.size());
        stats.put("ordersDelivered", delivered.size());

        // 3. Efficiency Boost (Mocked logic or simple calculation)
        // e.g., ratio of delivered to total orders?
        double efficiency = 0;
        int totalHandled = received.size() + delivered.size() + inTransit.size();
        if (totalHandled > 0) {
            efficiency = ((double) delivered.size() / totalHandled) * 100;
        }
        stats.put("efficiencyBoost", String.format("%.1f%%", efficiency + 15)); // Mocking a boost

        // 4. Demand Forecasting (Crop types delivered count)
        Map<String, Long> cropDemand = delivered.stream()
                .map(o -> {
                    Crop c = cropRepo.findById(o.getCropId()).orElse(null);
                    return c != null ? c.getCropName() : "Unknown";
                })
                .collect(Collectors.groupingBy(name -> name, Collectors.counting()));

        stats.put("demandForecast", cropDemand);

        return stats;
    }
}
