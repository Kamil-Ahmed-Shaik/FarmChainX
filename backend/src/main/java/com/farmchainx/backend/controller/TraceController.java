package com.farmchainx.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.farmchainx.backend.entity.OwnershipHistory;
import com.farmchainx.backend.repository.OwnershipHistoryRepository;

import io.jsonwebtoken.io.IOException;

@RestController
@RequestMapping("/trace")
@CrossOrigin
public class TraceController {

    @Autowired private OwnershipHistoryRepository historyRepo;
    
    @GetMapping("/{cropId}")
    public List<OwnershipHistory> trace(@PathVariable Long cropId) {
        //return cropService.getTrace(cropId);
        return historyRepo.findByCropId(cropId);

    }
    @GetMapping("/download/{cropId}")
    public ResponseEntity<Resource> downloadTrace(@PathVariable Long cropId) throws IOException {

        List<OwnershipHistory> logs = historyRepo.findByCropId(cropId);

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Owner Role,Owner ID,Username,Timestamp\n");

        for (OwnershipHistory h : logs) {
            csv.append(h.getId()).append(",")
               .append(h.getOwnerRole()).append(",")
               .append(h.getOwnerId()).append(",")
               .append(h.getUsername()).append(",")
               .append(h.getTimestamp()).append("\n");
        }

        ByteArrayResource resource =
            new ByteArrayResource(csv.toString().getBytes());

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=crop_" + cropId + "_trace_logs.csv")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(resource);
    }


}
