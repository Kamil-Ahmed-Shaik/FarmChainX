package com.farmchainx.backend.dto;

public class ShipmentUpdateDTO {
	private String location;
	private String conditionData;
	private String status;
	private Double latitude;
	private Double longitude;

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getConditionData() {
		return conditionData;
	}

	public void setConditionData(String conditionData) {
		this.conditionData = conditionData;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
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
}
