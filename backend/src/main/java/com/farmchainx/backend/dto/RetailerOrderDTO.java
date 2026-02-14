package com.farmchainx.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class RetailerOrderDTO {
    // Order details
    private Long orderId;
    private String orderStatus;
    private LocalDateTime createdAt;
    private String deliveryAddress;
    private String deliveryPhone;

    // Crop details
    private Long cropId;
    private String cropName;
    private Double quantity;
    private Long price;
    private String qualityGrade;
    private LocalDate harvestDate;
    private String imagePath;
    private String blockchainHash;

    // Farmer details
    private Long farmerId;
    private String farmerUsername;
    private String farmName;
    private String farmerMobile;
    private String farmLocation;
    private Double farmerLatitude;
    private Double farmerLongitude;

    // Distributor details
    private Long distributorId;
    private String distributorUsername;
    private String distributorCompany;
    private String distributorRegion;

    // Current ownership
    private String currentOwnerRole;
    private String currentOwnerName;

    // History
    private List<OwnershipLogDTO> ownershipHistory;
    private List<ShipmentLogDTO> shipmentHistory;

    // Getters and Setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getDeliveryPhone() {
        return deliveryPhone;
    }

    public void setDeliveryPhone(String deliveryPhone) {
        this.deliveryPhone = deliveryPhone;
    }

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

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Long getPrice() {
        return price;
    }

    public void setPrice(Long price) {
        this.price = price;
    }

    public String getQualityGrade() {
        return qualityGrade;
    }

    public void setQualityGrade(String qualityGrade) {
        this.qualityGrade = qualityGrade;
    }

    public LocalDate getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(LocalDate harvestDate) {
        this.harvestDate = harvestDate;
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

    public Long getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(Long farmerId) {
        this.farmerId = farmerId;
    }

    public String getFarmerUsername() {
        return farmerUsername;
    }

    public void setFarmerUsername(String farmerUsername) {
        this.farmerUsername = farmerUsername;
    }

    public String getFarmName() {
        return farmName;
    }

    public void setFarmName(String farmName) {
        this.farmName = farmName;
    }

    public String getFarmerMobile() {
        return farmerMobile;
    }

    public void setFarmerMobile(String farmerMobile) {
        this.farmerMobile = farmerMobile;
    }

    public String getFarmLocation() {
        return farmLocation;
    }

    public void setFarmLocation(String farmLocation) {
        this.farmLocation = farmLocation;
    }

    public Double getFarmerLatitude() {
        return farmerLatitude;
    }

    public void setFarmerLatitude(Double farmerLatitude) {
        this.farmerLatitude = farmerLatitude;
    }

    public Double getFarmerLongitude() {
        return farmerLongitude;
    }

    public void setFarmerLongitude(Double farmerLongitude) {
        this.farmerLongitude = farmerLongitude;
    }

    public Long getDistributorId() {
        return distributorId;
    }

    public void setDistributorId(Long distributorId) {
        this.distributorId = distributorId;
    }

    public String getDistributorUsername() {
        return distributorUsername;
    }

    public void setDistributorUsername(String distributorUsername) {
        this.distributorUsername = distributorUsername;
    }

    public String getDistributorCompany() {
        return distributorCompany;
    }

    public void setDistributorCompany(String distributorCompany) {
        this.distributorCompany = distributorCompany;
    }

    public String getDistributorRegion() {
        return distributorRegion;
    }

    public void setDistributorRegion(String distributorRegion) {
        this.distributorRegion = distributorRegion;
    }

    public String getCurrentOwnerRole() {
        return currentOwnerRole;
    }

    public void setCurrentOwnerRole(String currentOwnerRole) {
        this.currentOwnerRole = currentOwnerRole;
    }

    public String getCurrentOwnerName() {
        return currentOwnerName;
    }

    public void setCurrentOwnerName(String currentOwnerName) {
        this.currentOwnerName = currentOwnerName;
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
