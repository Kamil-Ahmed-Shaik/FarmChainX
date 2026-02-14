package com.farmchainx.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import com.farmchainx.backend.dto.*;
import com.farmchainx.backend.entity.*;
import com.farmchainx.backend.repository.*;

@Service
public class CropService {

    @Autowired
    private CropRepository cropRepo;
    @Autowired
    private OwnershipHistoryRepository historyRepo;
    @Autowired
    private BlockchainService blockchainService;
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private OrderRepository orderRepo;

    // Farmer adds crop
    public Crop addCrop(Long farmerId, CropRequestDTO dto) throws IOException {

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
        cropRepo.save(crop);

        // Create Genesis Block on Blockchain
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

    public List<Crop> getPendingCrops() {
        return cropRepo.findByStatus("PENDING");
    }

    public List<Crop> getVerfiedCrops() {
        return cropRepo.findByStatus("VERIFIED");
    }

    // View farmer crops
    public List<Crop> getFarmerCrops(Long farmerId) {
        return cropRepo.findByFarmerId(farmerId);
    }

    // view all products not belongs to the farmer
    public List<Crop> getProductsNotBelongsToFarmer(Long farmerId) {
        return cropRepo.findCropsNotOwned(farmerId);
    }

    // Admin verify
    public void verifyCrop(Long cropId) {
        Crop crop = cropRepo.findById(cropId).orElseThrow();
        crop.setStatus("VERIFIED");
        cropRepo.save(crop);
    }

    // Ownership transfer (Manual)
    public void transferOwnership(Long cropId, String role, Long ownerId) {

        Crop crop = cropRepo.findById(cropId).orElseThrow();
        crop.setFarmerId(ownerId); // Update owner in DB
        cropRepo.save(crop);

        // Add Transaction Block
        blockchainService.addTransactionBlock(crop);

        OwnershipHistory history = new OwnershipHistory();
        User user = userRepo.findById(ownerId).orElseThrow();
        history.setCropId(cropId);
        history.setOwnerRole(role);
        history.setOwnerId(ownerId);
        history.setUsername(user.getUsername());
        history.setTimestamp(LocalDateTime.now().toString());

        historyRepo.save(history);
    }

    public List<OwnershipHistory> getTrace(Long cropId) {
        return historyRepo.findByCropId(cropId);
    }

    public List<Order> getorders(Long farmerId) {
        return orderRepo.findBySellerId(farmerId);
    }
}
