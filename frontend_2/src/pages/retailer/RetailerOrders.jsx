import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProductDetailsModal from "../../components/ProductDetailsModal";
import axios from "../../api/axiosInstance";
import "../../styles/Components.css";
import "../../styles/RetailerOrders.css";

export default function RetailerOrders() {
    const retailerId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const status = localStorage.getItem("status");

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [filter, setFilter] = useState("ALL");

    const fetchOrders = useCallback(async () => {
        try {
            const res = await axios.get(`/retailer/orders/${retailerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, [retailerId, token]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const openOrderDetails = (order) => {
        // Prepare product object for modal from order data
        const productForModal = {
            id: order.cropId,
            cropName: order.cropName,
            imagePath: order.imagePath,
            price: order.price,
            quantity: order.quantity,
            qualityGrade: order.qualityGrade,
            username: order.farmerUsername,
            harvestDate: order.harvestDate,
            location: order.farmLocation,
            blockchainHash: order.blockchainHash
        };
        setSelectedProduct(productForModal);
        setShowDetailsModal(true);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "PENDING": return "status-pending";
            case "ACCEPTED": return "status-accepted";
            case "REJECTED": return "status-rejected";
            case "IN_TRANSIT": return "status-transit";
            case "DELIVERED": return "status-delivered";
            default: return "";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "PENDING": return "⏳";
            case "ACCEPTED": return "✅";
            case "REJECTED": return "❌";
            case "IN_TRANSIT": return "🚚";
            case "DELIVERED": return "📦";
            default: return "📝";
        }
    };

    const filteredOrders = filter === "ALL"
        ? orders
        : orders.filter(o => o.orderStatus === filter);

    const orderCounts = {
        ALL: orders.length,
        PENDING: orders.filter(o => o.orderStatus === "PENDING").length,
        ACCEPTED: orders.filter(o => o.orderStatus === "ACCEPTED").length,
        IN_TRANSIT: orders.filter(o => o.orderStatus === "IN_TRANSIT").length,
        DELIVERED: orders.filter(o => o.orderStatus === "DELIVERED").length
    };

    return status === "false" ? (
        <DashboardLayout role="retailer" display={true}>
            <header className="dashboard-header">
                <h2 className="dashboard-title">📦 My Orders</h2>
                <p className="dashboard-subtitle">Track all your orders and their delivery status</p>
            </header>

            <div className="orders-container">
                {/* Filter Tabs */}
                <div className="order-filter-tabs">
                    {["ALL", "PENDING", "ACCEPTED", "IN_TRANSIT", "DELIVERED"].map(tab => (
                        <button
                            key={tab}
                            className={`filter-tab ${filter === tab ? 'active' : ''} ${tab.toLowerCase()}`}
                            onClick={() => setFilter(tab)}
                        >
                            <span className="tab-label">{tab.replace("_", " ")}</span>
                            <span className="tab-count">{orderCounts[tab]}</span>
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading your orders...</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {filteredOrders.length === 0 ? (
                            <div className="no-orders">
                                <span className="no-orders-icon">📭</span>
                                <h3>No orders found</h3>
                                <p>Start shopping from the marketplace to place your first order.</p>
                            </div>
                        ) : (
                            filteredOrders.map(order => (
                                <div key={order.orderId} className="order-card-enhanced">
                                    <div className="order-card-header">
                                        <div className="order-id-badge">
                                            Order #{order.orderId}
                                        </div>
                                        <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                                            {getStatusIcon(order.orderStatus)} {order.orderStatus?.replace("_", " ")}
                                        </span>
                                    </div>

                                    <div className="order-card-body">
                                        <div className="order-product">
                                            <img src={`/uploads/${order.imagePath}`} alt={order.cropName} />
                                            <div className="order-product-info">
                                                <h4>{order.cropName}</h4>
                                                <p><b>Quantity:</b> {order.quantity} kg</p>
                                                <p><b>Price:</b> <span className="price">₹{order.price}</span></p>
                                                <p><b>Quality:</b> {order.qualityGrade}</p>
                                            </div>
                                        </div>

                                        <div className="order-parties">
                                            <div className="party farmer">
                                                <span className="party-icon">👨‍🌾</span>
                                                <div className="party-info">
                                                    <small>Farmer</small>
                                                    <strong>{order.farmerUsername}</strong>
                                                    <span>{order.farmName}</span>
                                                </div>
                                            </div>

                                            <div className="party-arrow">→</div>

                                            <div className="party distributor">
                                                <span className="party-icon">🚚</span>
                                                <div className="party-info">
                                                    <small>Distributor</small>
                                                    <strong>{order.distributorUsername || "Pending"}</strong>
                                                    <span>{order.distributorCompany || "N/A"}</span>
                                                </div>
                                            </div>

                                            <div className="party-arrow">→</div>

                                            <div className="party you">
                                                <span className="party-icon">🏪</span>
                                                <div className="party-info">
                                                    <small>You</small>
                                                    <strong>Your Shop</strong>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="order-meta">
                                            <span>📅 Ordered: {order.createdAt?.substring(0, 10)}</span>
                                            <span>📍 {order.deliveryAddress?.substring(0, 30)}...</span>
                                        </div>
                                    </div>

                                    <div className="order-card-footer">
                                        <button className="btn btn-outline" onClick={() => openOrderDetails(order)}>
                                            🔍 Trace Product
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Product Details & Traceability Modal */}
            <ProductDetailsModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                product={selectedProduct}
            />
        </DashboardLayout>
    ) : (
        <DashboardLayout role="retailer" display={false}>
            <h2>Blocked</h2>
            <p>You are blocked by admin</p>
        </DashboardLayout>
    );
}