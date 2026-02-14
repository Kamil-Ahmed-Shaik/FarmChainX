package com.farmchainx.backend.controller;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.farmchainx.backend.dto.AdminProfileDTO;
import com.farmchainx.backend.dto.AdminTransactionDTO;
import com.farmchainx.backend.dto.FarmerProfileDTO;
import com.farmchainx.backend.dto.OwnershipLogDTO;
import com.farmchainx.backend.dto.ProfileUpdateDTO;
import com.farmchainx.backend.dto.ShipmentLogDTO;
import com.farmchainx.backend.dto.admincropresponseDTO;
import com.farmchainx.backend.entity.Admin;
import com.farmchainx.backend.entity.Crop;
import com.farmchainx.backend.entity.Distributor;
import com.farmchainx.backend.entity.Farmer;
import com.farmchainx.backend.entity.Order;
import com.farmchainx.backend.entity.OwnershipHistory;
import com.farmchainx.backend.entity.Retailer;
import com.farmchainx.backend.entity.Shipment;
import com.farmchainx.backend.entity.User;
import com.farmchainx.backend.entity.Consumer;
import com.farmchainx.backend.repository.AdminRepository;
import com.farmchainx.backend.repository.CropRepository;
import com.farmchainx.backend.repository.DistributorRepository;
import com.farmchainx.backend.repository.FarmerRepository;
import com.farmchainx.backend.repository.OrderRepository;
import com.farmchainx.backend.repository.OwnershipHistoryRepository;
import com.farmchainx.backend.repository.RetailerRepository;
import com.farmchainx.backend.repository.ShipmentRepository;
import com.farmchainx.backend.repository.UserRepository;
import com.farmchainx.backend.repository.ConsumerRepository;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private AdminRepository adminRepo;
    @Autowired
    private CropRepository cropRepo;
    @Autowired
    private FarmerRepository farmerRepo;
    @Autowired
    private RetailerRepository retailerRepo;
    @Autowired
    private DistributorRepository distributorRepo;
    @Autowired
    private OrderRepository orderRepo;
    @Autowired
    private OwnershipHistoryRepository ownershipRepo;
    @Autowired
    private ShipmentRepository shipmentRepo;
    @Autowired
    private ConsumerRepository consumerRepo;

    // Admin profile
    @Autowired
    private com.farmchainx.backend.repository.ReportRepository reportRepo;

    @GetMapping("/{id}/profile")
    public AdminProfileDTO getProfile(@PathVariable Long id, Authentication auth) throws AccessDeniedException {
        // return adminService.getProfile(id, auth.getName());
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(auth.getName())) {
            throw new AccessDeniedException("Not your profile");
        }

        Admin admin = adminRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        AdminProfileDTO dto = new AdminProfileDTO();
        dto.setDepartment(admin.getDepartment());
        dto.setBlock(user.isBlocked());
        dto.setRole(user.getRole());
        dto.setUsername(user.getUsername());
        dto.setLatitude(admin.getLatitude());
        dto.setLongitude(admin.getLongitude());

        return dto;
    }

    @PostMapping("/{id}/profile")
    public AdminProfileDTO updateProfile(@PathVariable Long id,
            @RequestBody AdminProfileDTO dto,
            Authentication auth) throws AccessDeniedException {
        // return adminService.updateProfile(id, auth.getName(), dto);
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getUsername().equals(auth.getName())) {
            throw new AccessDeniedException("Not your profile");
        }

        Admin admin = adminRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        admin.setLatitude(dto.getLatitude());
        admin.setLongitude(dto.getLongitude());
        admin.setDepartment(dto.getDepartment());
        adminRepo.save(admin);

        return dto;
    }

    // User management
    @GetMapping("/users")
    public List<ProfileUpdateDTO> getAllUsers() {
        // return adminService.getAllUsers();
        return userRepo.findAll().stream()
                .filter(u -> !u.getRole().equals("ADMIN"))
                .map(u -> {
                    ProfileUpdateDTO dto = new ProfileUpdateDTO();
                    dto.setUserId(u.getId());
                    dto.setUserName(u.getUsername());
                    dto.setRole(u.getRole());
                    dto.setBlocked(u.isBlocked());
                    if (u.getRole().equals("DISTRIBUTOR")) {
                        Distributor d = distributorRepo.findById(u.getId())
                                .orElseThrow(() -> new RuntimeException("Distributor not found"));
                        dto.setCompanyName(d.getCompanyName());
                        dto.setRegion(d.getRegion());

                    } else if (u.getRole().equals("FARMER")) {
                        Farmer f = farmerRepo.findById(u.getId())
                                .orElseThrow(() -> new RuntimeException("Farmer not found"));
                        dto.setAadhar(f.getAadhar());
                        dto.setAcres(f.getAcres());
                        dto.setCropType(f.getCropType());
                        dto.setExpectedYield(f.getExpectedYield());
                        dto.setFarmLocation(f.getFarmLocation());
                        dto.setFarmName(f.getFarmName());
                        dto.setLandPhoto(f.getLandPhoto());
                        dto.setLatitude(f.getLatitude());
                        dto.setLongitude(f.getLongitude());
                        dto.setStatus(f.getStatus());
                        dto.setMobile(f.getMobile());
                        dto.setLocation1(f.getLocation());
                        dto.setSoil_type(f.getSoil_type());

                    } else if (u.getRole().equals("RETAILER")) {
                        Retailer r = retailerRepo.findById(u.getId())
                                .orElseThrow(() -> new RuntimeException("Retailer not found"));
                        dto.setShopName(r.getShopName());
                        dto.setLocation(r.getLocation());
                    } else if (u.getRole().equals("CONSUMER")) {
                        Consumer c = consumerRepo.findById(u.getId())
                                .orElseThrow(() -> new RuntimeException("Consumer not found"));
                        dto.setFullName(c.getFullName());
                        dto.setAddress(c.getAddress());
                        dto.setCity(c.getCity());
                        dto.setState(c.getState());
                        dto.setPincode(c.getPincode());
                        dto.setMobile(c.getMobile());
                        dto.setLatitude(c.getLatitude());
                        dto.setLongitude(c.getLongitude());
                    }
                    return dto;
                })
                .toList();

    }

    @PostMapping("/users/{id}/block")
    public String block(@PathVariable Long id) {
        // adminService.blockUser(id);
        User u = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        u.setBlocked(true);
        userRepo.save(u);
        return "User blocked";
    }

    @PostMapping("/users/{id}/unblock")
    public String unblock(@PathVariable Long id) {
        // adminService.unblockUser(id);\
        User u = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        u.setBlocked(false);
        userRepo.save(u);
        return "User unblocked";
    }

    @GetMapping("/users/{id}/verify")
    public ProfileUpdateDTO verifyUser(
            @PathVariable Long id) {

        // return adminService.getUserByRole(id);
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProfileUpdateDTO dto = new ProfileUpdateDTO();
        dto.setUserId(user.getId());
        dto.setUserName(user.getUsername());
        dto.setRole(user.getRole());

        switch (user.getRole().toUpperCase()) {

            case "FARMER":
                Farmer f = farmerRepo.findById(id)
                        .orElseThrow(() -> new RuntimeException("Farmer not found"));

                dto.setFarmName(f.getFarmName());
                dto.setCropType(f.getCropType());
                dto.setLocation1(f.getLocation());
                dto.setFarmLocation(f.getFarmLocation());
                dto.setMobile(f.getMobile());
                dto.setAcres(f.getAcres());
                dto.setExpectedYield(f.getExpectedYield());
                dto.setSoil_type(f.getSoil_type());
                dto.setAadhar(f.getAadhar());
                dto.setStatus(f.getStatus());
                break;

            case "ADMIN":
                Admin a = adminRepo.findById(id)
                        .orElseThrow(() -> new RuntimeException("Admin not found"));
                dto.setDepartment(a.getDepartment());
                break;

            case "DISTRIBUTOR":
                Distributor d = distributorRepo.findById(id)
                        .orElseThrow(() -> new RuntimeException("Distributor not found"));
                dto.setCompanyName(d.getCompanyName());
                dto.setRegion(d.getRegion());
                break;

            case "RETAILER":
                Retailer r = retailerRepo.findById(id)
                        .orElseThrow(() -> new RuntimeException("Retailer not found"));
                dto.setShopName(r.getShopName());
                dto.setLocation(r.getLocation());
                break;

            default:
                throw new RuntimeException("Invalid role");
        }

        return dto;

    }

    // Inbording
    @GetMapping("/inbording")
    public List<Farmer> getPendingFarmers() {
        // return adminService.getPendingFarmers();
        return farmerRepo.findByStatus("PENDING");
    }

    @GetMapping("/inbording/{id}/verify")
    public FarmerProfileDTO verify(@PathVariable Long id) {
        // return adminService.verifyFarmer(id);
        Farmer f = farmerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        FarmerProfileDTO dto = new FarmerProfileDTO();
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setFarmName(f.getFarmName());
        dto.setCropType(f.getCropType());
        dto.setLocation(f.getLocation());
        dto.setFarmLocation(f.getFarmLocation());
        dto.setMobile(f.getMobile());
        dto.setAcres(f.getAcres());
        dto.setExpectedYield(f.getExpectedYield());
        dto.setSoil_type(f.getSoil_type());
        dto.setAadhar(f.getAadhar());
        dto.setStatus(f.getStatus());
        dto.setBlock(user.isBlocked());
        return dto;
    }

    @PostMapping("/inbording/{id}/approve")
    public String approve(@PathVariable Long id) {
        // adminService.approveFarmer(id);
        Farmer f = farmerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        f.setStatus("APPROVED");
        farmerRepo.save(f);
        return "Farmer approved";
    }

    @PostMapping("/inbording/{id}/reject")
    public String reject(@PathVariable Long id) {
        // adminService.rejectFarmer(id);
        Farmer f = farmerRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        f.setStatus("REJECTED");
        farmerRepo.save(f);
        return "Farmer rejected";
    }

    @GetMapping("/crops")
    public List<admincropresponseDTO> allpendingcrops() {
        List<Crop> list_crops = cropRepo.findByStatus("PENDING");
        List<admincropresponseDTO> result = new ArrayList<>();
        for (Crop c : list_crops) {
            admincropresponseDTO temp = new admincropresponseDTO();
            // Use findById for safer lookups
            Farmer temp_farmer = farmerRepo.findById(c.getFarmerId()).orElse(null);
            User usr = userRepo.findById(c.getFarmerId()).orElse(null);

            temp.setCropName(c.getCropName());
            temp.setId(c.getId());
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

            if (temp_farmer != null) {
                temp.setFarmName(temp_farmer.getFarmName());
                temp.setCropType(temp_farmer.getCropType());
                temp.setMobile(temp_farmer.getMobile());
                temp.setAcres(temp_farmer.getAcres());
                temp.setFarmer_status(temp_farmer.getStatus());
            }

            if (usr != null) {
                temp.setUsername(usr.getUsername());
            }
            result.add(temp);
        }
        return result;
    }

    @PostMapping("/crops/{cropId}/verify")
    public String verifycrop(@PathVariable Long cropId) {
        // cropService.verifyCrop(cropId);
        Crop crop = cropRepo.findById(cropId).orElseThrow();
        crop.setStatus("VERIFIED");
        cropRepo.save(crop);
        return "Crop verified";
    }

    @PostMapping("/crops/{cropId}/reject")
    public String rejectcrop(@PathVariable Long cropId) {
        // cropService.verifyCrop(cropId);
        Crop crop = cropRepo.findById(cropId).orElseThrow();
        crop.setStatus("REJECTED");
        cropRepo.save(crop);
        return "Crop verified";
    }

    // ==================== TRANSACTION ENDPOINTS ====================

    @GetMapping("/transactions")
    public List<AdminTransactionDTO> getAllTransactions() {
        List<Order> orders = orderRepo.findAllNonPendingOrders();
        List<AdminTransactionDTO> result = new ArrayList<>();

        for (Order ord : orders) {
            AdminTransactionDTO dto = buildTransactionDTO(ord);
            result.add(dto);
        }
        return result;
    }

    @GetMapping("/transactions/{orderId}/verify")
    public AdminTransactionDTO getTransactionDetails(@PathVariable Long orderId) {
        Order ord = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return buildTransactionDTO(ord);
    }

    private AdminTransactionDTO buildTransactionDTO(Order ord) {
        AdminTransactionDTO dto = new AdminTransactionDTO();

        // Order details
        dto.setOrderId(ord.getId());
        dto.setOrderStatus(ord.getStatus());
        dto.setCreatedAt(ord.getCreatedAt());
        dto.setDeliveryAddress(ord.getAddress());
        dto.setDeliveryPhone(ord.getPhno());
        dto.setDistributorId(ord.getDistributorId());
        dto.setDistributorName(ord.getDistributorName());

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
            dto.setCropLatitude(crop.getLatitude());
            dto.setCropLongitude(crop.getLongitude());
        }

        // Seller (Farmer) details
        User sellerUser = userRepo.findById(ord.getSellerId()).orElse(null);
        Farmer farmer = farmerRepo.findById(ord.getSellerId()).orElse(null);
        if (sellerUser != null) {
            dto.setSellerId(sellerUser.getId());
            dto.setSellerUsername(sellerUser.getUsername());
        }
        if (farmer != null) {
            dto.setFarmName(farmer.getFarmName());
            dto.setFarmerMobile(farmer.getMobile());
            dto.setFarmLocation(farmer.getFarmLocation());
            dto.setFarmerLatitude(farmer.getLatitude());
            dto.setFarmerLongitude(farmer.getLongitude());
        }

        // Buyer details
        User buyerUser = userRepo.findById(ord.getBuyerId()).orElse(null);
        if (buyerUser != null) {
            dto.setBuyerId(buyerUser.getId());
            dto.setBuyerUsername(buyerUser.getUsername());
            dto.setBuyerRole(buyerUser.getRole());

            if ("RETAILER".equals(buyerUser.getRole())) {
                Retailer retailer = retailerRepo.findById(ord.getBuyerId()).orElse(null);
                if (retailer != null) {
                    dto.setBuyerShopName(retailer.getShopName());
                    dto.setBuyerLocation(retailer.getLocation());
                    dto.setBuyerLatitude(retailer.getLatitude());
                    dto.setBuyerLongitude(retailer.getLongitude());
                }
            } else if ("DISTRIBUTOR".equals(buyerUser.getRole())) {
                Distributor distributor = distributorRepo.findById(ord.getBuyerId()).orElse(null);
                if (distributor != null) {
                    dto.setBuyerCompanyName(distributor.getCompanyName());
                    dto.setBuyerLocation(distributor.getRegion());
                    dto.setBuyerLatitude(distributor.getLatitude());
                    dto.setBuyerLongitude(distributor.getLongitude());
                }
            }
        }

        // Distributor details if assigned
        if (ord.getDistributorId() != null) {
            Distributor dist = distributorRepo.findById(ord.getDistributorId()).orElse(null);
            if (dist != null) {
                dto.setDistributorCompany(dist.getCompanyName());
            }
        }

        // Ownership history
        List<OwnershipHistory> ownershipList = ownershipRepo.findByCropId(ord.getCropId());
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

    // ==================== REPORTS ENDPOINTS ====================

    @GetMapping("/reports")
    public List<com.farmchainx.backend.entity.Report> getSystemReports() {
        return reportRepo.findAll();
    }

    @PostMapping("/reports/generate")
    public String generateReport() {
        // Simple mock report generation
        com.farmchainx.backend.entity.Report report = new com.farmchainx.backend.entity.Report();
        report.setType("SYSTEM_HEALTH");
        report.setGeneratedBy("ADMIN");
        report.setContent("System is running normally. User count: " + userRepo.count());
        reportRepo.save(report);
        return "Report generated";
    }

    // ==================== DISPUTE ENDPOINTS ====================
    @Autowired
    private com.farmchainx.backend.repository.DisputeRepository disputeRepo;

    @GetMapping("/disputes")
    public List<com.farmchainx.backend.entity.Dispute> getAllDisputes() {
        return disputeRepo.findAll();
    }

    @PostMapping("/disputes/{id}/resolve")
    public String resolveDispute(@PathVariable Long id, @RequestBody String notes) {
        com.farmchainx.backend.entity.Dispute dispute = disputeRepo.findById(id).orElseThrow();
        dispute.setStatus("RESOLVED");
        dispute.setResolutionNotes(notes);
        disputeRepo.save(dispute);
        return "Dispute resolved successfully";
    }
}
