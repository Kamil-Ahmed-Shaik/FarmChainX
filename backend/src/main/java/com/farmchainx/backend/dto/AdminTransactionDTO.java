package com.farmchainx.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class AdminTransactionDTO {
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
    private Double cropLatitude;
    private Double cropLongitude;

    // Seller (Farmer) details
    private Long sellerId;
    private String sellerUsername;
    private String farmName;
    private String farmerMobile;
    private String farmLocation;
    private Double farmerLatitude;
    private Double farmerLongitude;

    // Buyer details
    private Long buyerId;
    private String buyerUsername;
    private String buyerRole;
    private String buyerCompanyName; // For distributor
    private String buyerShopName; // For retailer
    private String buyerLocation;
    private Double buyerLatitude;
    private Double buyerLongitude;

    // Distributor details (if assigned)
    private Long distributorId;
    private String distributorName;
    private String distributorCompany;

    // Ownership history
    private List<OwnershipLogDTO> ownershipHistory;

    // Shipment history
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

    public Double getCropLatitude() {
        return cropLatitude;
    }

    public void setCropLatitude(Double cropLatitude) {
        this.cropLatitude = cropLatitude;
    }

    public Double getCropLongitude() {
        return cropLongitude;
    }

    public void setCropLongitude(Double cropLongitude) {
        this.cropLongitude = cropLongitude;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public String getSellerUsername() {
        return sellerUsername;
    }

    public void setSellerUsername(String sellerUsername) {
        this.sellerUsername = sellerUsername;
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

    public Long getBuyerId() {
        return buyerId;
    }

    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public String getBuyerUsername() {
        return buyerUsername;
    }

    public void setBuyerUsername(String buyerUsername) {
        this.buyerUsername = buyerUsername;
    }

    public String getBuyerRole() {
        return buyerRole;
    }

    public void setBuyerRole(String buyerRole) {
        this.buyerRole = buyerRole;
    }

    public String getBuyerCompanyName() {
        return buyerCompanyName;
    }

    public void setBuyerCompanyName(String buyerCompanyName) {
        this.buyerCompanyName = buyerCompanyName;
    }

    public String getBuyerShopName() {
        return buyerShopName;
    }

    public void setBuyerShopName(String buyerShopName) {
        this.buyerShopName = buyerShopName;
    }

    public String getBuyerLocation() {
        return buyerLocation;
    }

    public void setBuyerLocation(String buyerLocation) {
        this.buyerLocation = buyerLocation;
    }

    public Double getBuyerLatitude() {
        return buyerLatitude;
    }

    public void setBuyerLatitude(Double buyerLatitude) {
        this.buyerLatitude = buyerLatitude;
    }

    public Double getBuyerLongitude() {
        return buyerLongitude;
    }

    public void setBuyerLongitude(Double buyerLongitude) {
        this.buyerLongitude = buyerLongitude;
    }

    public Long getDistributorId() {
        return distributorId;
    }

    public void setDistributorId(Long distributorId) {
        this.distributorId = distributorId;
    }

    public String getDistributorName() {
        return distributorName;
    }

    public void setDistributorName(String distributorName) {
        this.distributorName = distributorName;
    }

    public String getDistributorCompany() {
        return distributorCompany;
    }

    public void setDistributorCompany(String distributorCompany) {
        this.distributorCompany = distributorCompany;
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
