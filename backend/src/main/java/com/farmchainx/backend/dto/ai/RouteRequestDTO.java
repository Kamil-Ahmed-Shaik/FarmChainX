package com.farmchainx.backend.dto.ai;

import java.util.List;
import java.util.Map;

public class RouteRequestDTO {
    private List<Map<String, Object>> locations;

    public List<Map<String, Object>> getLocations() {
        return locations;
    }

    public void setLocations(List<Map<String, Object>> locations) {
        this.locations = locations;
    }
}
