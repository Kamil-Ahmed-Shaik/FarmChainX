package com.farmchainx.backend.controller;

import com.farmchainx.backend.dto.ai.*;
import com.farmchainx.backend.service.AIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*") // Allow frontend access
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/disease-detection")
    public ResponseEntity<Map> detectDisease(@RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(aiService.detectDisease(file));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to process image"));
        }
    }

    @PostMapping("/yield-prediction")
    public ResponseEntity<Map> predictYield(@RequestBody YieldRequestDTO request) {
        return ResponseEntity.ok(aiService.predictYield(request));
    }

    @PostMapping("/smart-pricing")
    public ResponseEntity<Map> suggestPrice(@RequestBody PriceRequestDTO request) {
        return ResponseEntity.ok(aiService.suggestPrice(request));
    }

    @PostMapping("/route-optimization")
    public ResponseEntity<Map> optimizeRoute(@RequestBody RouteRequestDTO request) {
        return ResponseEntity.ok(aiService.optimizeRoute(request));
    }

    @PostMapping("/chat")
    public ResponseEntity<Map> chatWithBot(@RequestBody ChatRequestDTO request) {
        return ResponseEntity.ok(aiService.chatWithBot(request));
    }

    @PostMapping("/demand-forecasting")
    public ResponseEntity<Map> demandForecast(@RequestBody Map<String, Object> data) {
        return ResponseEntity.ok(aiService.getDemandForecast(data));
    }

    @PostMapping("/dynamic-pricing")
    public ResponseEntity<Map> dynamicPricing(@RequestBody Map<String, Object> data) {
        return ResponseEntity.ok(aiService.getDynamicPrice(data));
    }

    @PostMapping("/auto-restock")
    public ResponseEntity<Map> autoRestock(@RequestBody Map<String, Object> data) {
        return ResponseEntity.ok(aiService.getAutoRestock(data));
    }

    @PostMapping("/quality-grading")
    public ResponseEntity<Map> qualityGrading(@RequestBody Map<String, Object> data) {
        return ResponseEntity.ok(aiService.getQualityGrade(data));
    }

    @PostMapping("/fraud-detection")
    public ResponseEntity<Map> detectFraud(@RequestBody Map<String, Object> data) {
        return ResponseEntity.ok(aiService.detectFraud(data));
    }
}
