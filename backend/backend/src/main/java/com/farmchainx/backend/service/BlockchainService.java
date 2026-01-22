package com.farmchainx.backend.service;

import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class BlockchainService {

    public String registerCropOnBlockchain(String cropName, String farmerId) {
        return "BC-" + UUID.randomUUID(); // Fake blockchain hash
    }

    public String transferOwnership(Long cropId, String newOwner) {
        return "TX-" + UUID.randomUUID();
    }
}
