package com.farmchainx.backend.service;

import com.farmchainx.backend.entity.Block;
import com.farmchainx.backend.repository.BlockRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BlockchainService {

    @Autowired
    private BlockRepository blockRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String registerCropOnBlockchain(Object data) {
        return createBlock(data, "GENESIS");
    }

    public String addTransactionBlock(Object data) {
        return createBlock(data, "TRANSACTION");
    }

    private String createBlock(Object data, String type) {
        Block lastBlock = blockRepository.findTopByOrderByIdDesc().orElse(null);
        String previousHash = (lastBlock != null) ? lastBlock.getHash() : "0";
        Long index = (lastBlock != null) ? lastBlock.getIndexId() + 1 : 0L;

        Block newBlock = new Block();
        newBlock.setIndexId(index);
        newBlock.setTimestamp(LocalDateTime.now().toString());
        newBlock.setPreviousHash(previousHash);
        newBlock.setType(type);
        
        try {
            newBlock.setData(objectMapper.writeValueAsString(data));
        } catch (Exception e) {
            newBlock.setData(data.toString());
        }

        mineBlock(newBlock);
        blockRepository.save(newBlock);

        return newBlock.getHash();
    }

    private void mineBlock(Block block) {
        long nonce = 0;
        String hash = "";
        String target = "00"; // Simple difficulty for demo

        while (true) {
            block.setNonce(nonce);
            hash = calculateHash(block);
            if (hash.substring(0, target.length()).equals(target)) {
                block.setHash(hash);
                break;
            }
            nonce++;
        }
    }

    private String calculateHash(Block block) {
        String input = block.getIndexId() + block.getTimestamp() + block.getData() + block.getPreviousHash() + block.getNonce();
        return applySha256(input);
    }

    private String applySha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    
    public List<Block> getAllBlocks() {
        return blockRepository.findAll();
    }
}
