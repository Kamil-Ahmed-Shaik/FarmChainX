package com.farmchainx.backend.dto;

import java.time.LocalDateTime;

public class FarmerOrdersDTO {

	private String role;
	private String username;

	// distributor details
	private String companyName;
	private String region;

	// retailer details
	private String shopName;
	private String location;

	// buyer location for distance calculation
	private Double buyerLatitude;
	private Double buyerLongitude;

	// Order details
	private Long id;

	private Long cropId;

	private String imagePath;
	private String cropName;

	private Long buyerId;
	private Long sellerId;

	private String status; // PENDING, ACCEPTED, REJECTED, DELIVERED

	private LocalDateTime createdAt;

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getUsername() {
		return username;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public String getCropName() {
		return cropName;
	}

	public void setCropName(String cropName) {
		this.cropName = cropName;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getRegion() {
		return region;
	}

	public void setRegion(String region) {
		this.region = region;
	}

	public String getShopName() {
		return shopName;
	}

	public void setShopName(String shopName) {
		this.shopName = shopName;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getCropId() {
		return cropId;
	}

	public void setCropId(Long cropId) {
		this.cropId = cropId;
	}

	public Long getBuyerId() {
		return buyerId;
	}

	public void setBuyerId(Long buyerId) {
		this.buyerId = buyerId;
	}

	public Long getSellerId() {
		return sellerId;
	}

	public void setSellerId(Long sellerId) {
		this.sellerId = sellerId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
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
}
