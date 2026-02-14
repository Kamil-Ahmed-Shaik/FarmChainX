package com.farmchainx.backend.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PriceRequestDTO {
    @JsonProperty("crop_name")
    private String cropName;
    @JsonProperty("variety")
    private String variety;
    @JsonProperty("market_trend")
    private String marketTrend;

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getVariety() {
        return variety;
    }

    public void setVariety(String variety) {
        this.variety = variety;
    }

    public String getMarketTrend() {
        return marketTrend;
    }

    public void setMarketTrend(String marketTrend) {
        this.marketTrend = marketTrend;
    }
}
