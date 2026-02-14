package com.farmchainx.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.farmchainx.backend.dto.OwnershipLogDTO;
import com.farmchainx.backend.dto.PublicTraceabilityDTO;
import com.farmchainx.backend.entity.Block;
import com.farmchainx.backend.entity.Crop;
import com.farmchainx.backend.entity.Farmer;
import com.farmchainx.backend.entity.OwnershipHistory;
import com.farmchainx.backend.repository.CropRepository;
import com.farmchainx.backend.repository.FarmerRepository;
import com.farmchainx.backend.repository.OwnershipHistoryRepository;
import com.farmchainx.backend.service.BlockchainService;

@RestController
@RequestMapping("/public")
public class PublicController {

    @Autowired
    private BlockchainService blockchainService;

    @Autowired
    private CropRepository cropRepo;

    @Autowired
    private OwnershipHistoryRepository historyRepo;

    @Autowired
    private FarmerRepository farmerRepo;

    @GetMapping("/blockchain")
    public List<Block> getBlockchain() {
        return blockchainService.getAllBlocks();
    }

    @GetMapping("/crop/{id}/trace")
    public PublicTraceabilityDTO getTraceability(@PathVariable Long id) {
        Crop crop = cropRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Crop not found"));

        Farmer farmer = farmerRepo.findById(crop.getFarmerId()).orElse(new Farmer());

        PublicTraceabilityDTO dto = new PublicTraceabilityDTO();
        dto.setCropId(crop.getId());
        dto.setCropName(crop.getCropName());
        dto.setFarmerName(farmer.getFarmName()); // Using Farm Name as Farmer Name
        dto.setOriginLocation(farmer.getLocation());
        dto.setHarvestDate(crop.getHarvestDate());
        dto.setQualityGrade(crop.getQualityGrade());
        dto.setImagePath(crop.getImagePath());
        dto.setBlockchainHash(crop.getBlockchainHash());
        dto.setVerified("VERIFIED".equals(crop.getStatus()));

        // Ownership History
        List<OwnershipHistory> history = historyRepo.findByCropId(id);
        List<OwnershipLogDTO> historyLogs = history.stream().map(h -> {
            OwnershipLogDTO log = new OwnershipLogDTO();
            log.setId(h.getId());
            log.setCropId(h.getCropId());
            log.setOwnerRole(h.getOwnerRole());
            log.setOwnerId(h.getOwnerId());
            log.setUsername(h.getUsername());
            log.setTimestamp(h.getTimestamp());
            return log;
        }).collect(Collectors.toList());
        dto.setOwnershipHistory(historyLogs);

        // Shipment History - Skipped for now as it requires complex order tracking from
        // crop
        dto.setShipmentHistory(List.of());

        return dto;
    }

    @GetMapping("/crop/search")
    public List<Crop> searchCrops(@RequestParam String name) {
        List<Crop> allCrops = cropRepo.findAll();
        return allCrops.stream()
                .filter(c -> c.getCropName() != null && c.getCropName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());
    }
}
