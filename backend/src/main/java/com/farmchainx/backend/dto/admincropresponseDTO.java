package com.farmchainx.backend.dto;

import java.time.LocalDate;

public class admincropresponseDTO {
	private Long id;

    private Long farmerId;
    private String cropName;
    private Double quantity;
    private LocalDate harvestDate;
    private Long price;
    private String qualityGrade;
    private String crop_status;

    private String blockchainHash;

    // NEW FIELDS
    private Double latitude;
    private Double longitude;

    private String imagePath;
    
    private String farmName;
    private String cropType;
    private String mobile;
    private Double acres;
    private String farmer_status;
    
    private String username;

	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getFarmerId() {
		return farmerId;
	}
	public void setFarmerId(Long farmerId) {
		this.farmerId = farmerId;
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
	public LocalDate getHarvestDate() {
		return harvestDate;
	}
	public void setHarvestDate(LocalDate harvestDate) {
		this.harvestDate = harvestDate;
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
	public String getCrop_status() {
		return crop_status;
	}
	public void setCrop_status(String crop_status) {
		this.crop_status = crop_status;
	}
	public String getBlockchainHash() {
		return blockchainHash;
	}
	public void setBlockchainHash(String blockchainHash) {
		this.blockchainHash = blockchainHash;
	}
	public Double getLatitude() {
		return latitude;
	}
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}
	public Double getLongitude() {
		return longitude;
	}
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
	public String getImagePath() {
		return imagePath;
	}
	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}
	public String getFarmName() {
		return farmName;
	}
	public void setFarmName(String farmName) {
		this.farmName = farmName;
	}
	public String getCropType() {
		return cropType;
	}
	public void setCropType(String cropType) {
		this.cropType = cropType;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public Double getAcres() {
		return acres;
	}
	public void setAcres(Double acres) {
		this.acres = acres;
	}
	public String getFarmer_status() {
		return farmer_status;
	}
	public void setFarmer_status(String farmer_status) {
		this.farmer_status = farmer_status;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
}
