package com.farmchainx.backend.controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.farmchainx.backend.dto.CropRequestDTO;
import com.farmchainx.backend.dto.FarmerOrderRequestDTO;
import com.farmchainx.backend.dto.FarmerOrdersDTO;
import com.farmchainx.backend.dto.FarmerProfileDTO;
import com.farmchainx.backend.dto.FarmerPurchaseDTO;
import com.farmchainx.backend.dto.OwnershipLogDTO;
import com.farmchainx.backend.dto.ShipmentLogDTO;
import com.farmchainx.backend.dto.DistributorListDTO;
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
@RequestMapping("/farmer")
public class FarmerController {

    @Autowired
    private CropRepository cropRepo;
    @Autowired
    private BlockchainService blockchainService;
    @Autowired
    private OwnershipHistoryRepository historyRepo;
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private FarmerRepository farmerRepo;
    @Autowired
    private DistributorRepository distribRepo;
    @Autowired
    private RetailerRepository retailerRepo;
    @Autowired
    private ShipmentRepository shipmentRepo;
    @Autowired
    private com.farmchainx.backend.repository.ConsumerRepository consumerRepo;

    @GetMapping("/{id}/profile")
    public FarmerProfileDTO getProfile(@PathVariable Long id, Authentication auth) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(auth.getName())) {
            throw new AccessDeniedException("Not your profile");
        }

        Farmer f = farmerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        FarmerProfileDTO fdto = new FarmerProfileDTO();
        fdto.setUsername(user.getUsername());
        fdto.setBlock(user.isBlocked());
        fdto.setRole(user.getRole());
        fdto.setAcres(f.getAcres());
        fdto.setCropType(f.getCropType());
        fdto.setExpectedYield(f.getExpectedYield());
        fdto.setFarmLocation(f.getFarmLocation());
        fdto.setFarmName(f.getFarmName());
        fdto.setLandPhoto(f.getLandPhoto());
        fdto.setLatitude(f.getLatitude());
        fdto.setLocation(f.getLocation());
        fdto.setLongitude(f.getLongitude());
        fdto.setMobile(f.getMobile());
        fdto.setStatus(f.getStatus());
        fdto.setAadhar(f.getAadhar());
        fdto.setSoil_type(f.getSoil_type());
        return fdto;

    }

    @PostMapping("/{id}/profile")
    public FarmerProfileDTO updateProfile(@PathVariable Long id,
            @RequestBody FarmerProfileDTO dto,
            Authentication auth) {
        User user = userRepo.findById(id).orElseThrow();
        if (!user.getUsername().equals(auth.getName())) {
            throw new AccessDeniedException("Not your profile");
        }

        Farmer f = farmerRepo.findById(id).orElseThrow();

        f.setFarmName(dto.getFarmName());
        f.setFarmLocation(dto.getFarmLocation());
        f.setLocation(dto.getLocation());
        f.setCropType(dto.getCropType());
        f.setMobile(dto.getMobile());
        f.setAcres(dto.getAcres());
        f.setExpectedYield(dto.getExpectedYield());
        f.setLatitude(dto.getLatitude());
        f.setLongitude(dto.getLongitude());
        f.setLandPhoto(dto.getLandPhoto());
        f.setAadhar(dto.getAadhar());
        f.setSoil_type(dto.getSoil_type());
        f.setStatus("PENDING"); // reset approval

        farmerRepo.save(f);
        return dto;

    }

    @PostMapping("/crops/{farmerId}")
    public Crop addCrop(
            @PathVariable Long farmerId, @RequestBody CropRequestDTO dto) throws Exception {

        Crop crop = new Crop();
        crop.setFarmerId(farmerId);
        crop.setCropName(dto.getCropName());
        crop.setQuantity(dto.getQuantity());
        crop.setHarvestDate(dto.getHarvestDate());
        crop.setQualityGrade(dto.getQualityGrade());
        crop.setLatitude(dto.getLatitude());
        crop.setLongitude(dto.getLongitude());
        crop.setStatus("PENDING");
        crop.setImagePath(dto.getImagePath());
        crop.setPrice(dto.getPrice());
        cropRepo.save(crop);

        String hash = blockchainService.registerCropOnBlockchain(crop);
        crop.setBlockchainHash(hash);

        cropRepo.save(crop);

        OwnershipHistory history = new OwnershipHistory();
        User user = userRepo.findById(farmerId).orElseThrow();
        history.setCropId(crop.getId());
        history.setOwnerRole("FARMER");
        history.setOwnerId(farmerId);
        history.setUsername(user.getUsername());
        history.setTimestamp(LocalDateTime.now().toString());
        historyRepo.save(history);

        return crop;

    }

    @GetMapping("/crops/{farmerId}")
    public List<Crop> getFarmerCrops(@PathVariable Long farmerId) {
        return cropRepo.findByFarmerId(farmerId);
    }

    @PostMapping("/crops/update")
    public Crop cropupdate(@RequestBody Crop crp) {

        Crop cp = cropRepo.getReferenceById(crp.getId());
        cp.setId(crp.getId());
        cp.setFarmerId(crp.getFarmerId());
        cp.setCropName(crp.getCropName());
        cp.setQuantity(crp.getQuantity());
        cp.setQualityGrade(crp.getQualityGrade());
        cp.setPrice(crp.getPrice());
        cp.setStatus(crp.getStatus());
        cp.setBlockchainHash(crp.getBlockchainHash());
        cp.setLatitude(crp.getLatitude());
        cp.setLongitude(crp.getLongitude());
        cp.setImagePath(cp.getImagePath());
        cropRepo.save(cp);
        return crp;

    }

    @DeleteMapping("/crops/delete/{crop_id}")
    public String cropdelete(@PathVariable Long crop_id) {
        cropRepo.deleteById(crop_id);
        historyRepo.deleteByCropId(crop_id);
        return "Crop has deleted sucessfully";
    }

    @GetMapping("/{cropId}")
    public List<OwnershipHistory> trace(@PathVariable Long cropId) {
        return historyRepo.findByCropId(cropId);
    }

    @GetMapping("/buy/crops/{farmerId}")
    public List<Crop> getAllCrops(@PathVariable Long farmerId) {
        List<Crop> availableCrops = cropRepo.findCropsNotOwned(farmerId);
        List<Order> myOrders = orderRepo.findByBuyerId(farmerId);
        List<Long> orderedCropIds = myOrders.stream()
                .map(Order::getCropId)
                .collect(java.util.stream.Collectors.toList());

        return availableCrops.stream()
                .filter(crop -> !orderedCropIds.contains(crop.getId()))
                .collect(java.util.stream.Collectors.toList());
    }

    @PostMapping("/transfer/{cropId}/{farmerId}")
    public String transferToFarmer(@PathVariable Long cropId,
            @PathVariable Long farmerId) {

        String role = "FARMER";

        Crop crp = cropRepo.findById(cropId).orElse(null);
        if (crp != null)
            blockchainService.addTransactionBlock(crp);
        else
            blockchainService.addTransactionBlock("Transfer Crop " + cropId + " to Farmer " + farmerId);

        OwnershipHistory history = new OwnershipHistory();
        User user = userRepo.findById(farmerId).orElseThrow();
        history.setCropId(cropId);
        history.setOwnerRole(role);
        history.setOwnerId(farmerId);
        history.setUsername(user.getUsername());
        history.setTimestamp(LocalDateTime.now().toString());

        historyRepo.save(history);
        return "Crop ownership transferred to farmer successfully";
    }

    @GetMapping("/distributors")
    public List<DistributorListDTO> getAllDistributors() {
        List<Distributor> distributors = distribRepo.findAll();
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
    public String placeOrder(@RequestBody FarmerOrderRequestDTO request) {
        // Get distributor name
        User distributorUser = userRepo.findById(request.getDistributorId()).orElse(null);
        String distributorName = distributorUser != null ? distributorUser.getUsername() : "";

        Order order = new Order();
        order.setCropId(request.getCropId());
        order.setSellerId(request.getFarmerId());
        order.setBuyerId(request.getBuyerId());
        order.setDistributorId(request.getDistributorId());
        order.setDistributorName(distributorName);
        order.setAddress(request.getAddress());
        order.setPhno(request.getPhone());
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());

        orderRepo.save(order);
        return "Order placed successfully";
    }

    @GetMapping("/orders/{farmerId}")
    public List<FarmerOrdersDTO> getorders(@PathVariable Long farmerId) {
        List<FarmerOrdersDTO> result = new ArrayList<>();
        List<Order> my_orders = orderRepo.findBySellerId(farmerId);
        for (Order ord : my_orders) {
            FarmerOrdersDTO temp = new FarmerOrdersDTO();
            Crop crp = cropRepo.getReferenceById(ord.getCropId());
            User usr = userRepo.getReferenceById(ord.getBuyerId());
            temp.setRole(usr.getRole());
            temp.setUsername(usr.getUsername());
            temp.setId(ord.getId());
            temp.setCropId(ord.getCropId());
            temp.setBuyerId(ord.getBuyerId());
            temp.setSellerId(farmerId);
            temp.setStatus(ord.getStatus());
            temp.setCreatedAt(ord.getCreatedAt());
            temp.setImagePath(crp.getImagePath());
            temp.setCropName(crp.getCropName());

            if ("DISTRIBUTOR".equals(usr.getRole())) {
                Distributor dis = distribRepo.findById(ord.getBuyerId()).orElse(new Distributor());
                temp.setCompanyName(dis.getCompanyName());
                temp.setRegion(dis.getRegion());
                temp.setBuyerLatitude(dis.getLatitude());
                temp.setBuyerLongitude(dis.getLongitude());
            } else if ("RETAILER".equals(usr.getRole())) {
                Retailer ret = retailerRepo.findById(ord.getBuyerId()).orElse(new Retailer());
                temp.setShopName(ret.getShopName());
                temp.setLocation(ret.getLocation());
                temp.setBuyerLatitude(ret.getLatitude());
                temp.setBuyerLongitude(ret.getLongitude());
            } else if ("CONSUMER".equals(usr.getRole())) {
                com.farmchainx.backend.entity.Consumer con = consumerRepo.findById(ord.getBuyerId())
                        .orElse(new com.farmchainx.backend.entity.Consumer());
                temp.setShopName(con.getFullName()); // Reusing shopName for fullname
                temp.setLocation(con.getAddress());
                temp.setBuyerLatitude(con.getLatitude());
                temp.setBuyerLongitude(con.getLongitude());
            } else {
                com.farmchainx.backend.entity.Farmer farmer = farmerRepo.findById(ord.getBuyerId())
                        .orElse(new Farmer());
                temp.setShopName(farmer.getFarmName());
                temp.setLocation(farmer.getLocation());
                temp.setBuyerLatitude(farmer.getLatitude());
                temp.setBuyerLongitude(farmer.getLongitude());
            }
            result.add(temp);

        }
        return result;
    }

    @PutMapping("/orders/{order_id}/reject")
    public String reject_order(@PathVariable Long order_id) {
        Order Result_order = orderRepo.getReferenceById(order_id);
        Result_order.setStatus("REJECTED");
        orderRepo.save(Result_order);
        return "Rejected Successfully";
    }

    @PutMapping("/orders/{order_id}/accept")
    public String accept_order(@PathVariable Long order_id) {
        Order result = orderRepo.getReferenceById(order_id);
        User buyer = userRepo.getReferenceById(result.getBuyerId());

        // Handle Direct Distributor Purchase
        if ("DISTRIBUTOR".equalsIgnoreCase(buyer.getRole())) {
            // Direct purchase: Status -> DELIVERED, Owner -> Distributor
            result.setStatus("DELIVERED");

            OwnershipHistory history = new OwnershipHistory();
            history.setCropId(result.getCropId());
            history.setOwnerId(result.getBuyerId()); // Distributor ID
            history.setOwnerRole("DISTRIBUTOR");
            history.setTimestamp(LocalDateTime.now().toString());
            history.setUsername(buyer.getUsername());
            historyRepo.save(history);

        } else {
            // Retailer/Consumer/Farmer Order: Status -> ACCEPTED, Owner -> Assigned
            // Distributor
            result.setStatus("ACCEPTED");

            // Transfer ownership to the assigned distributor (for transit)
            if (result.getDistributorId() != null) {
                User distributorUser = userRepo.findById(result.getDistributorId()).orElseThrow();

                OwnershipHistory history = new OwnershipHistory();
                history.setCropId(result.getCropId());
                history.setOwnerId(result.getDistributorId());
                history.setOwnerRole("DISTRIBUTOR");
                history.setTimestamp(LocalDateTime.now().toString());
                history.setUsername(distributorUser.getUsername());
                historyRepo.save(history);
            }
        }

        orderRepo.save(result);

        // Change the status of the crop
        Crop crp = cropRepo.getReferenceById(result.getCropId());
        crp.setStatus("SOLD_OUT");

        // For Distributor purchases, the distributor becomes the new "farmer" (owner)
        if ("DISTRIBUTOR".equalsIgnoreCase(buyer.getRole())) {
            crp.setFarmerId(result.getBuyerId());
        }

        cropRepo.save(crp);

        // Record the transaction on the blockchain
        blockchainService.addTransactionBlock(crp);

        // Reject all other pending orders for this crop
        List<Order> list_order = orderRepo.findByCropIdAndOrderIdNot(result.getCropId(), order_id);
        for (Order order : list_order) {
            order.setStatus("SOLD_OUT");
        }
        orderRepo.saveAll(list_order);

        return "Accept Successfully";
    }

    @GetMapping("/purchases/{farmerId}")
    public List<FarmerPurchaseDTO> getFarmerPurchases(@PathVariable Long farmerId) {
        // Use a broader check to ensure we get all orders where farmer is buyer
        List<Order> orders = orderRepo.findByBuyerId(farmerId);
        List<FarmerPurchaseDTO> result = new ArrayList<>();
        // Sort by date descending
        orders.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

        for (Order ord : orders) {
            result.add(buildFarmerPurchaseDTO(ord));
        }
        return result;
    }

    private FarmerPurchaseDTO buildFarmerPurchaseDTO(Order ord) {
        FarmerPurchaseDTO dto = new FarmerPurchaseDTO();

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

        // Seller (Original Farmer) details
        User sellerUser = userRepo.findById(ord.getSellerId()).orElse(null);
        Farmer sellerFarmer = farmerRepo.findById(ord.getSellerId()).orElse(null);
        if (sellerUser != null) {
            dto.setSellerId(sellerUser.getId());
            dto.setSellerUsername(sellerUser.getUsername());
        }
        if (sellerFarmer != null) {
            dto.setFarmName(sellerFarmer.getFarmName());
            dto.setSellerMobile(sellerFarmer.getMobile());
            dto.setFarmLocation(sellerFarmer.getFarmLocation());
            dto.setSellerLatitude(sellerFarmer.getLatitude());
            dto.setSellerLongitude(sellerFarmer.getLongitude());
        }

        // Distributor details
        if (ord.getDistributorId() != null) {
            User distUser = userRepo.findById(ord.getDistributorId()).orElse(null);
            Distributor dist = distribRepo.findById(ord.getDistributorId()).orElse(null);
            if (distUser != null) {
                dto.setDistributorId(distUser.getId());
                dto.setDistributorUsername(distUser.getUsername());
            }
            if (dist != null) {
                dto.setDistributorCompany(dist.getCompanyName());
                dto.setDistributorRegion(dist.getRegion());
            }
        }

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
        }).collect(java.util.stream.Collectors.toList());
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
        }).collect(java.util.stream.Collectors.toList());
        dto.setShipmentHistory(shipmentLogs);

        return dto;
    }
}
