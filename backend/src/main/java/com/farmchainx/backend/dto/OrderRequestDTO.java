package com.farmchainx.backend.dto;

public class OrderRequestDTO {
    private Long cropId;
    private Long buyerId;
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
}

