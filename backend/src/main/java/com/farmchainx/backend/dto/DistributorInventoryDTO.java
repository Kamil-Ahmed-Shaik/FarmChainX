package com.farmchainx.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class DistributorInventoryDTO {
    // Order details
    private Long orderId;
    private String orderStatus;
    private LocalDateTime createdAt;
    private String deliveryAddress;
    private String deliveryPhone;

    // Tab category: RECEIVED, IN_TRANSIT, DELIVERED
    private String tabCategory;

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

    // Retailer details (buyer)
    private Long retailerId;
    private String retailerUsername;
    private String retailerShopName;
    private String retailerLocation;
    private Double retailerLatitude;
    private Double retailerLongitude;

    // Shipment count for tab determination
    private int shipmentCount;

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

    public String getTabCategory() {
        return tabCategory;
    }

    public void setTabCategory(String tabCategory) {
        this.tabCategory = tabCategory;
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

    public Long getRetailerId() {
        return retailerId;
    }

    public void setRetailerId(Long retailerId) {
        this.retailerId = retailerId;
    }

    public String getRetailerUsername() {
        return retailerUsername;
    }

    public void setRetailerUsername(String retailerUsername) {
        this.retailerUsername = retailerUsername;
    }

    public String getRetailerShopName() {
        return retailerShopName;
    }

    public void setRetailerShopName(String retailerShopName) {
        this.retailerShopName = retailerShopName;
    }

    public String getRetailerLocation() {
        return retailerLocation;
    }

    public void setRetailerLocation(String retailerLocation) {
        this.retailerLocation = retailerLocation;
    }

    public Double getRetailerLatitude() {
        return retailerLatitude;
    }

    public void setRetailerLatitude(Double retailerLatitude) {
        this.retailerLatitude = retailerLatitude;
    }

    public Double getRetailerLongitude() {
        return retailerLongitude;
    }

    public void setRetailerLongitude(Double retailerLongitude) {
        this.retailerLongitude = retailerLongitude;
    }

    public int getShipmentCount() {
        return shipmentCount;
    }

    public void setShipmentCount(int shipmentCount) {
        this.shipmentCount = shipmentCount;
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
