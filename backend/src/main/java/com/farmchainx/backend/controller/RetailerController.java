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

import com.farmchainx.backend.dto.DistributorCropInfo;
import com.farmchainx.backend.dto.DistributorListDTO;
import com.farmchainx.backend.dto.OwnershipLogDTO;
import com.farmchainx.backend.dto.RetailerOrderDTO;
import com.farmchainx.backend.dto.RetailerOrderRequestDTO;
import com.farmchainx.backend.dto.RetailerProfileDTO;
import com.farmchainx.backend.dto.ShipmentLogDTO;
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
@RequestMapping("/retailer")
public class RetailerController {

    @Autowired
    private RetailerRepository retailerRepo;
    @Autowired
    private OwnershipHistoryRepository historyRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private BlockchainService blockchainService;
    @Autowired
    private CropRepository cropRepo;
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private DistributorRepository distributorRepo;
    @Autowired
    private FarmerRepository farmerRepo;
    @Autowired
    private ShipmentRepository shipmentRepo;

    @GetMapping("/{id}/profile")
    public RetailerProfileDTO getProfile(@PathVariable Long id, Authentication auth) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(auth.getName())) {
            throw new AccessDeniedException("Not your profile");
        }

        Retailer r = retailerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Retailer not found"));

        RetailerProfileDTO dto = new RetailerProfileDTO();
        dto.setShopName(r.getShopName());
        dto.setLocation(r.getLocation());
        dto.setRole(user.getRole());
        dto.setBlock(user.isBlocked());
        dto.setUsername(user.getUsername());
        dto.setLatitude(r.getLatitude());
        dto.setLongitude(r.getLongitude());

        return dto;
    }

    @PostMapping("/{id}/profile")
    public RetailerProfileDTO updateProfile(@PathVariable Long id,
            @RequestBody RetailerProfileDTO dto,
            Authentication auth) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(auth.getName())) {
            throw new AccessDeniedException("Not your profile");
        }

        Retailer r = retailerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Retailer not found"));

        r.setLatitude(dto.getLatitude());
        r.setLongitude(dto.getLongitude());
        r.setShopName(dto.getShopName());
        r.setLocation(dto.getLocation());

        retailerRepo.save(r);
        return dto;
    }

    @PostMapping("/transfer/{cropId}/{retailerId}")
    public String transferToRetailer(@PathVariable Long cropId,
            @PathVariable Long retailerId) {

        String role = "RETAILER";
        Crop crp = cropRepo.findById(cropId).orElse(null);
        if (crp != null)
            blockchainService.addTransactionBlock(crp);
        else
            blockchainService.addTransactionBlock("Transfer Crop " + cropId + " to Retailer " + retailerId);

        OwnershipHistory history = new OwnershipHistory();
        User user = userRepo.findById(retailerId).orElseThrow();
        history.setCropId(cropId);
        history.setOwnerRole(role);
        history.setOwnerId(retailerId);
        history.setUsername(user.getUsername());
        history.setTimestamp(LocalDateTime.now().toString());

        historyRepo.save(history);
        return "Crop ownership transferred to Retailer successfully";
    }

    // ==================== MARKETPLACE ENDPOINTS ====================

    @GetMapping("/marketplace/{retailerId}")
    public List<DistributorCropInfo> getMarketplaceCrops(@PathVariable Long retailerId) {
        // Get all verified crops from farmers
        List<Crop> list_crp = cropRepo.findByStatus("VERIFIED");

        return filterOrderedCrops(list_crp, retailerId);
    }

    // Helper to filter out already ordered crops (common logic)
    private List<DistributorCropInfo> filterOrderedCrops(List<Crop> crops, Long userId) {
        List<Order> myOrders = orderRepo.findByBuyerId(userId);
        List<Long> orderedCropIds = myOrders.stream()
                .map(Order::getCropId)
                .collect(java.util.stream.Collectors.toList());

        List<Crop> filteredCrops = crops.stream()
                .filter(c -> !orderedCropIds.contains(c.getId()))
                .collect(java.util.stream.Collectors.toList());

        return buildDistributorCropInfoList(filteredCrops);
    }

    private List<DistributorCropInfo> buildDistributorCropInfoList(List<Crop> crops) {
        List<DistributorCropInfo> result = new ArrayList<>();
        for (Crop cp : crops) {
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
    public String placeOrder(@RequestBody RetailerOrderRequestDTO request) {
        // Get distributor name
        User distributorUser = userRepo.findById(request.getDistributorId()).orElse(null);
        String distributorName = distributorUser != null ? distributorUser.getUsername() : "";

        Order order = new Order();
        order.setCropId(request.getCropId());
        order.setSellerId(request.getFarmerId());
        order.setBuyerId(request.getRetailerId());
        order.setDistributorId(request.getDistributorId());
        order.setDistributorName(distributorName);
        order.setAddress(request.getAddress());
        order.setPhno(request.getPhone());
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());

        orderRepo.save(order);
        return "Order placed successfully";
    }

    // ==================== RETAILER ORDERS ENDPOINTS ====================

    @GetMapping("/orders/{retailerId}")
    public List<RetailerOrderDTO> getRetailerOrders(@PathVariable Long retailerId) {
        List<Order> orders = orderRepo.findAllByRetailerId(retailerId);
        List<RetailerOrderDTO> result = new ArrayList<>();

        for (Order ord : orders) {
            RetailerOrderDTO dto = buildRetailerOrderDTO(ord);
            result.add(dto);
        }
        return result;
    }

    @GetMapping("/orders/{orderId}/details")
    public RetailerOrderDTO getOrderDetails(@PathVariable Long orderId) {
        Order ord = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return buildRetailerOrderDTO(ord);
    }

    private RetailerOrderDTO buildRetailerOrderDTO(Order ord) {
        RetailerOrderDTO dto = new RetailerOrderDTO();

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

    @GetMapping("/market")
    public List<Crop> getallcrops() {
        return cropRepo.findByStatus("VERIFIED");
    }

    @GetMapping("/myorders/{retailerId}")
    public List<Crop> getmyorders() {
        return null;
    }

    // ==================== RETAILER STORAGE ENDPOINTS ====================

    @PostMapping("/update-price")
    public String updateCropPrice(@RequestBody java.util.Map<String, Object> request) {
        Long cropId = Long.valueOf(request.get("cropId").toString());
        Long newPrice = Math.round(Double.valueOf(request.get("newPrice").toString()));

        Crop crop = cropRepo.findById(cropId)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        // Only allow price update if not published yet
        if ("PUBLISHED".equals(crop.getStatus())) {
            throw new RuntimeException("Cannot update price after publishing");
        }

        crop.setPrice(newPrice);
        cropRepo.save(crop);

        return "Price updated successfully";
    }

    @PostMapping("/publish-crop")
    public String publishCrop(@RequestBody java.util.Map<String, String> request) {
        Long cropId = Long.valueOf(request.get("cropId"));

        Crop crop = cropRepo.findById(cropId)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        // Change status to PUBLISHED to make it available for consumers
        crop.setStatus("PUBLISHED");
        cropRepo.save(crop);

        // Add blockchain transaction for publishing
        blockchainService.addTransactionBlock(crop);

        return "Crop published successfully";
    }

}
