package com.farmchainx.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "crops")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long farmerId;
    private String cropName;
    private Double quantity;
    private String harvestDate;
    private String qualityGrade;

    private String blockchainHash;   // Immutable record
    private String status;           // PENDING / VERIFIED / SOLD
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
	public String getBlockchainHash() {
		return blockchainHash;
	}
	public void setBlockchainHash(String blockchainHash) {
		this.blockchainHash = blockchainHash;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}

    // Getters & Setters
}
