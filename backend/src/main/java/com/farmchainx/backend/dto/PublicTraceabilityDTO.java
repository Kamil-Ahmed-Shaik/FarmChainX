package com.farmchainx.backend.dto;

import java.time.LocalDate;
import java.util.List;

public class PublicTraceabilityDTO {
    // Crop Info
    private Long cropId;
    private String cropName;
    private String farmerName; // or Farm Name
    private String originLocation;
    private LocalDate harvestDate;
    private String qualityGrade;
    private String imagePath;

    // Blockchain
    private String blockchainHash;
    private boolean isVerified;

    // Journey
    private List<OwnershipLogDTO> ownershipHistory;
    private List<ShipmentLogDTO> shipmentHistory;

    // Getters and Setters
    public Long getCropId() {
        return cropId;
    }

    public void setCropId(Long cropId) {
        this.cropId = cropId;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getFarmerName() {
        return farmerName;
    }

    public void setFarmerName(String farmerName) {
        this.farmerName = farmerName;
    }

    public String getOriginLocation() {
        return originLocation;
    }

    public void setOriginLocation(String originLocation) {
        this.originLocation = originLocation;
    }

    public LocalDate getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(LocalDate harvestDate) {
        this.harvestDate = harvestDate;
    }

    public String getQualityGrade() {
        return qualityGrade;
    }

    public void setQualityGrade(String qualityGrade) {
        this.qualityGrade = qualityGrade;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getBlockchainHash() {
        return blockchainHash;
    }

    public void setBlockchainHash(String blockchainHash) {
        this.blockchainHash = blockchainHash;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public List<OwnershipLogDTO> getOwnershipHistory() {
        return ownershipHistory;
    }

    public void setOwnershipHistory(List<OwnershipLogDTO> ownershipHistory) {
        this.ownershipHistory = ownershipHistory;
    }

    public List<ShipmentLogDTO> getShipmentHistory() {
        return shipmentHistory;
    }

    public void setShipmentHistory(List<ShipmentLogDTO> shipmentHistory) {
        this.shipmentHistory = shipmentHistory;
    }
}
