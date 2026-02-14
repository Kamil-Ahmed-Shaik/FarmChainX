package com.farmchainx.backend.dto;

import java.time.LocalDate;

public class CropRequestDTO {
    private String cropName;
    private Double quantity;
    private LocalDate harvestDate;
    private String qualityGrade;
    private Double latitude;
    private Double longitude;
    private String imagePath;
    private Long price;
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
	public Long getPrice() {
		return price;
	}
	public void setPrice(Long price) {
		this.price = price;
	}
}
