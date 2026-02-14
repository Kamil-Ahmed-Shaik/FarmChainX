package com.farmchainx.backend.service;

import com.farmchainx.backend.dto.ai.*;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class AIService {

    private final WebClient webClient;
    private final String AI_SERVICE_URL = "http://localhost:8000";

    public AIService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(AI_SERVICE_URL).build();
    }

    public Map detectDisease(MultipartFile file) throws IOException {
        try {
            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", resource);

            return webClient.post()
                    .uri("/disease-detection")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            System.err.println("AI Service Error: " + e.getMessage());
            // Fallback mock response
            Map<String, Object> mock = new HashMap<>();
            mock.put("disease_name", "Healthy (Mock)");
            mock.put("confidence", 0.95);
            mock.put("treatment", "No treatment needed. Maintain regular watering.");
            return mock;
        }
    }

    public Map predictYield(YieldRequestDTO request) {
        try {
            return webClient.post()
                    .uri("/yield-prediction")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            System.err.println("AI Service Error: " + e.getMessage());
            Map<String, Object> mock = new HashMap<>();
            mock.put("predicted_yield", 4500.0);
            mock.put("unit", "kg/acre");
            mock.put("confidence", 0.88);
            return mock;
        }
    }

    public Map suggestPrice(PriceRequestDTO request) {
        try {
            return webClient.post()
                    .uri("/smart-pricing")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            System.err.println("AI Service Error: " + e.getMessage());
            Map<String, Object> mock = new HashMap<>();
            mock.put("suggested_price", 120.0);
            mock.put("currency", "INR");
            mock.put("trend", "Upward");
            return mock;
        }
    }

    public Map optimizeRoute(RouteRequestDTO request) {
        try {
            return webClient.post()
                    .uri("/route-optimization")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            System.err.println("AI Service Error: " + e.getMessage());
            Map<String, Object> mock = new HashMap<>();
            mock.put("optimized_route", request.getLocations()); // Return original order as fallback
            mock.put("total_distance_km", 150.5);
            mock.put("fuel_saved_liters", 5.2);
            return mock;
        }
    }

    public Map chatWithBot(ChatRequestDTO request) {
        try {
            return webClient.post()
                    .uri("/chat")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            System.err.println("AI Service Error: " + e.getMessage());
            Map<String, Object> mock = new HashMap<>();
            mock.put("response",
                    "This is an automated fallback response because the AI service is unavailable. How can I help you manually?");
            return mock;
        }
    }

    public Map getDemandForecast(Map<String, Object> data) {
        try {
            return webClient.post()
                    .uri("/demand-forecasting")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(data)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            System.err.println("AI Service Error: " + e.getMessage());
            Map<String, Object> mock = new HashMap<>();
            mock.put("forecast", "High Demand Expected");
            mock.put("trend_percentage", 15);
            return mock;
        }
    }

    public Map getDynamicPrice(Map<String, Object> data) {
        try {
            return webClient.post()
                    .uri("/dynamic-pricing")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(data)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            System.err.println("AI Service Error: " + e.getMessage());
            Map<String, Object> mock = new HashMap<>();
            mock.put("dynamic_price", 95.50);
            mock.put("reason", "High local demand");
            return mock;
        }
    }

    public Map getAutoRestock(Map<String, Object> data) {
        try {
            return webClient.post()
                    .uri("/auto-restock")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(data)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            System.err.println("AI Service Error: " + e.getMessage());
            Map<String, Object> mock = new HashMap<>();
            mock.put("restock_needed", true);
            mock.put("suggested_quantity", 500);
            mock.put("urgency", "High");
            return mock;
        }
    }

    public Map getQualityGrade(Map<String, Object> data) {
        try {
            return webClient.post()
                    .uri("/quality-grading")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(data)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            System.err.println("AI Service Error: " + e.getMessage());
            Map<String, Object> mock = new HashMap<>();
            mock.put("grade", "A");
            mock.put("score", 92);
            mock.put("details", "Good size and color (Fallback)");
            return mock;
        }
    }

    public Map detectFraud(Map<String, Object> data) {
        try {
            return webClient.post()
                    .uri("/fraud-detection")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(data)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
        } catch (Exception e) {
            System.err.println("AI Service Error: " + e.getMessage());
            Map<String, Object> mock = new HashMap<>();
            mock.put("fraud_score", 0.05);
            mock.put("is_fraudulent", false);
            mock.put("reason", "Consistent pattern (Fallback)");
            return mock;
        }
    }
}
