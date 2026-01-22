package com.farmchainx.backend.dto;

public class CropRequestDTO {
    private String cropName;
    private Double quantity;
    private String harvestDate;
    private String qualityGrade;
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
	public String getHarvestDate() {
		return harvestDate;
	}
	public void setHarvestDate(String harvestDate) {
		this.harvestDate = harvestDate;
	}
	public String getQualityGrade() {
		return qualityGrade;
	}
	public void setQualityGrade(String qualityGrade) {
		this.qualityGrade = qualityGrade;
	}
}
