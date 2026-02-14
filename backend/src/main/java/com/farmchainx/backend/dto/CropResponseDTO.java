package com.farmchainx.backend.dto;

public class CropResponseDTO {
    private Long id;
    private String cropName;
    private Double quantity;
    private String harvestDate;
    private String blockchainHash;
    private String status;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
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
}
