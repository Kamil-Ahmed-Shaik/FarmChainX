package com.farmchainx.backend.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;

public class YieldRequestDTO {
    @JsonProperty("crop_type")
    private String cropType;
    @JsonProperty("acreage")
    private double acreage;
    @JsonProperty("soil_ph")
    private double soilPh;
    @JsonProperty("rainfall")
    private double rainfall;

    public String getCropType() {
        return cropType;
    }

    public void setCropType(String cropType) {
        this.cropType = cropType;
    }

    public double getAcreage() {
        return acreage;
    }

    public void setAcreage(double acreage) {
        this.acreage = acreage;
    }

    public double getSoilPh() {
        return soilPh;
    }

    public void setSoilPh(double soilPh) {
        this.soilPh = soilPh;
    }

    public double getRainfall() {
        return rainfall;
    }

    public void setRainfall(double rainfall) {
        this.rainfall = rainfall;
    }
}
