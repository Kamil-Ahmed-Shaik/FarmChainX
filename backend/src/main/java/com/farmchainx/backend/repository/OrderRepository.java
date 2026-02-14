package com.farmchainx.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.farmchainx.backend.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findBySellerId(Long sellerId);

    List<Order> findByBuyerId(Long buyerId);

    List<Order> findByCropId(Long cropId);

    @Query("SELECT o FROM Order o WHERE o.cropId = :cropId AND o.id <> :orderId")
    List<Order> findByCropIdAndOrderIdNot(@Param("cropId") Long cropId,
            @Param("orderId") Long orderId);

    @Query("SELECT o FROM Order o WHERE o.sellerId = :farmerId AND o.status='PENDING'")
    List<Order> findByPendingandfarmerId(@Param("farmerId") Long farmerId);

    // For distributor inventory - orders assigned to distributor with ACCEPTED
    // status (Received tab)
    @Query("SELECT o FROM Order o WHERE o.distributorId = :distributorId AND o.status = 'ACCEPTED'")
    List<Order> findAcceptedByDistributorId(@Param("distributorId") Long distributorId);

    // For distributor inventory - orders with IN_TRANSIT status
    @Query("SELECT o FROM Order o WHERE o.distributorId = :distributorId AND o.status = 'IN_TRANSIT'")
    List<Order> findInTransitByDistributorId(@Param("distributorId") Long distributorId);

    // For distributor inventory - orders with DELIVERED status
    @Query("SELECT o FROM Order o WHERE o.distributorId = :distributorId AND o.status = 'DELIVERED'")
    List<Order> findDeliveredByDistributorId(@Param("distributorId") Long distributorId);

    // For retailer orders - all orders where retailer is the buyer
    @Query("SELECT o FROM Order o WHERE o.buyerId = :retailerId ORDER BY o.createdAt DESC")
    List<Order> findAllByRetailerId(@Param("retailerId") Long retailerId);

    // For admin transactions - all orders that are not PENDING
    @Query("SELECT o FROM Order o WHERE o.status <> 'PENDING' ORDER BY o.createdAt DESC")
    List<Order> findAllNonPendingOrders();

}
