package com.farmchainx.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.farmchainx.backend.dto.ShipmentUpdateDTO;
import com.farmchainx.backend.entity.Shipment;
import com.farmchainx.backend.repository.ShipmentRepository;

@Service
public class ShipmentService {

    @Autowired private ShipmentRepository shipmentRepo;

    public Shipment updateShipment(Long orderId, ShipmentUpdateDTO dto){

        Shipment ship = new Shipment();
        ship.setOrderId(orderId);
        ship.setLocation(dto.getLocation());
        ship.setConditionData(dto.getConditionData());
        ship.setStatus(dto.getStatus());

        return shipmentRepo.save(ship);
    }

    public List<Shipment> getShipmentByOrder(Long orderId){
        return shipmentRepo.findByOrderId(orderId);
    }
}
