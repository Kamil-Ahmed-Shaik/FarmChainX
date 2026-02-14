package com.farmchainx.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.farmchainx.backend.dto.*;
import com.farmchainx.backend.entity.Admin;
import com.farmchainx.backend.entity.Distributor;
import com.farmchainx.backend.entity.Farmer;
import com.farmchainx.backend.entity.Retailer;
import com.farmchainx.backend.entity.User;
import com.farmchainx.backend.exception.InvalidCredentialsException;
import com.farmchainx.backend.exception.UserNotFoundException;
import com.farmchainx.backend.repository.AdminRepository;
import com.farmchainx.backend.repository.DistributorRepository;
import com.farmchainx.backend.repository.FarmerRepository;
import com.farmchainx.backend.repository.RetailerRepository;
import com.farmchainx.backend.repository.UserRepository;
import com.farmchainx.backend.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private FarmerRepository farmerRepo;
    @Autowired
    private DistributorRepository distributorRepo;
    @Autowired
    private RetailerRepository retailerRepo;
    @Autowired
    private AdminRepository adminRepo;
    @Autowired
    private com.farmchainx.backend.repository.ConsumerRepository consumerRepo;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        // return ResponseEntity.ok(authService.register(req));
        String result;
        if (userRepo.findByUsername(req.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole());

        user = userRepo.save(user);
        System.out.print(user);

        switch (req.getRole().toUpperCase()) {

            case "FARMER":
                Farmer f = new Farmer();
                f.setUserId(user.getId());
                f.setCropType(req.getCropType());
                f.setFarmName(req.getFarmName());
                f.setLocation(req.getLocation());
                f.setFarmLocation(req.getFarmLocation());
                f.setStatus("PENDING");
                farmerRepo.save(f);
                break;

            case "DISTRIBUTOR":
                Distributor d = new Distributor();
                d.setUserId(user.getId());
                d.setCompanyName(req.getCompanyName());
                d.setRegion(req.getRegion());
                distributorRepo.save(d);
                break;

            case "RETAILER":
                Retailer r = new Retailer();
                r.setUserId(user.getId());
                r.setShopName(req.getShopName());
                r.setLocation(req.getLocation());
                retailerRepo.save(r);
                break;

            case "ADMIN":
                Admin a = new Admin();
                a.setUserId(user.getId());
                a.setDepartment(req.getDepartment());
                adminRepo.save(a);
                break;

            case "CONSUMER":
                com.farmchainx.backend.entity.Consumer c = new com.farmchainx.backend.entity.Consumer();
                c.setUserId(user.getId());
                c.setFullName(req.getFullName());
                consumerRepo.save(c);
                break;

            default:
                throw new RuntimeException("Invalid role");
        }

        result = "Registration successful";
        return ResponseEntity.ok(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        // return ResponseEntity.ok(authService.login(req));
        User user = userRepo.findByUsername(req.getUsername())
                .orElseThrow(() -> new UserNotFoundException("User not registered. Please register first"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())
                || !user.getRole().equalsIgnoreCase(req.getRole())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());

        LoginResponseDTO res = new LoginResponseDTO();
        res.setToken(token);
        res.setRole(user.getRole());
        res.setUserId(user.getId());
        res.setStatus(user.isBlocked());
        return ResponseEntity.ok(res);
    }
}
