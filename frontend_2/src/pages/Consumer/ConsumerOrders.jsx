import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import "../../styles/Components.css";
import "../../styles/ConsumerOrders.css";

export default function ConsumerOrders() {
    const consumerId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState("ALL");
    const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
    const [disputeReason, setDisputeReason] = useState("");
    const [disputeDescription, setDisputeDescription] = useState("");
    const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

    const fetchOrders = useCallback(async () => {
        try {
            const res = await axios.get(`/consumer/orders/${consumerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    }, [consumerId, token]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const openOrderDetails = async (orderId) => {
        try {
            const res = await axios.get(`/consumer/orders/${orderId}/details`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedOrder(res.data);
        } catch (error) {
            console.error("Error fetching order details:", error);
        }
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
        setIsDisputeModalOpen(false);
    };

    const handleRaiseDispute = async (e) => {
        e.preventDefault();
        setIsSubmittingDispute(true);
        try {
            await axios.post("/consumer/dispute", {
                orderId: selectedOrder.orderId,
                reason: disputeReason,
                description: disputeDescription
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Dispute raised successfully. An administrator will review your case.");
            setIsDisputeModalOpen(false);
            setDisputeReason("");
            setDisputeDescription("");
        } catch (error) {
            console.error("Error raising dispute:", error);
            alert("Failed to raise dispute. Please try again.");
        } finally {
            setIsSubmittingDispute(false);
        }
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

    return (
        <DashboardLayout role="consumer" display={true}>
            <header className="dashboard-header">
                <h2 className="dashboard-title">📦 My Orders</h2>
                <p className="dashboard-subtitle">Track your farm-to-table deliveries</p>
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
                            <div className="orders-matrix-grid">
                                {filteredOrders.map(order => (
                                    <div key={order.orderId} className="order-item-card" onClick={() => openOrderDetails(order.orderId)}>
                                        <div className="order-item-image">
                                            <img src={`/uploads/${order.imagePath}`} alt={order.cropName} />
                                            <span className={`status-tag ${getStatusClass(order.orderStatus)}`}>{order.orderStatus}</span>
                                        </div>
                                        <div className="order-item-info">
                                            <h4>{order.cropName}</h4>
                                            <p className="order-date">Ordered: {order.createdAt?.substring(0, 10)}</p>
                                            <p className="order-quantity">{order.quantity} kg</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Order Details Overlay */}
            {selectedOrder && (
                <div className="overlay">
                    <div className="order-details-modal">
                        <button className="modal-close" onClick={closeOrderDetails}>×</button>

                        <div className="modal-header">
                            <h2>📋 Order Details</h2>
                            <span className={`status-badge large ${getStatusClass(selectedOrder.orderStatus)}`}>
                                {getStatusIcon(selectedOrder.orderStatus)} {selectedOrder.orderStatus?.replace("_", " ")}
                            </span>
                        </div>

                        <div className="modal-body">
                            {/* Order Progress Bar */}
                            <div className="order-progress">
                                <div className={`progress-step ${["PENDING", "ACCEPTED", "IN_TRANSIT", "DELIVERED"].includes(selectedOrder.orderStatus) ? 'completed' : ''}`}>
                                    <span className="step-icon">📝</span>
                                    <span className="step-label">Ordered</span>
                                </div>
                                <div className={`progress-step ${["ACCEPTED", "IN_TRANSIT", "DELIVERED"].includes(selectedOrder.orderStatus) ? 'completed' : ''}`}>
                                    <span className="step-icon">✅</span>
                                    <span className="step-label">Accepted</span>
                                </div>
                                <div className={`progress-step ${["IN_TRANSIT", "DELIVERED"].includes(selectedOrder.orderStatus) ? 'completed' : ''}`}>
                                    <span className="step-icon">🚚</span>
                                    <span className="step-label">In Transit</span>
                                </div>
                                <div className={`progress-step ${selectedOrder.orderStatus === "DELIVERED" ? 'completed' : ''}`}>
                                    <span className="step-icon">📦</span>
                                    <span className="step-label">Delivered</span>
                                </div>
                            </div>

                            {/* Product Details */}
                            <div className="detail-section">
                                <h3>🌾 Product Details</h3>
                                <div className="product-detail-grid">
                                    <img src={`/uploads/${selectedOrder.imagePath}`} alt={selectedOrder.cropName} />
                                    <div className="product-info">
                                        <p><b>Crop Name:</b> {selectedOrder.cropName}</p>
                                        <p><b>Quantity:</b> {selectedOrder.quantity} kg</p>
                                        <p><b>Price:</b> ₹{selectedOrder.price}</p>
                                        <p><b>Quality Grade:</b> {selectedOrder.qualityGrade}</p>
                                        <p><b>Harvest Date:</b> {selectedOrder.harvestDate}</p>
                                        <p><b>Blockchain Hash:</b> <code>{selectedOrder.blockchainHash?.substring(0, 20)}...</code></p>
                                    </div>
                                </div>
                            </div>

                            {/* Farmer Details */}
                            <div className="detail-section">
                                <h3>👨‍🌾 Farmer Details</h3>
                                <div className="detail-grid">
                                    <p><b>Username:</b> {selectedOrder.farmerUsername}</p>
                                    <p><b>Farm Name:</b> {selectedOrder.farmName}</p>
                                    <p><b>Location:</b> {selectedOrder.farmLocation}</p>
                                    <p><b>Mobile:</b> {selectedOrder.farmerMobile}</p>
                                </div>
                            </div>

                            {/* Distributor Details */}
                            <div className="detail-section">
                                <h3>🚚 Distributor Details</h3>
                                <div className="detail-grid">
                                    <p><b>Username:</b> {selectedOrder.distributorUsername || "N/A"}</p>
                                    <p><b>Company:</b> {selectedOrder.distributorCompany || "N/A"}</p>
                                    <p><b>Region:</b> {selectedOrder.distributorRegion || "N/A"}</p>
                                </div>
                            </div>

                            {/* Delivery Details */}
                            <div className="detail-section">
                                <h3>📍 Delivery Details</h3>
                                <div className="detail-grid">
                                    <p><b>Address:</b> {selectedOrder.deliveryAddress}</p>
                                    <p><b>Phone:</b> {selectedOrder.deliveryPhone}</p>
                                    <p><b>Order Date:</b> {selectedOrder.createdAt?.substring(0, 16).replace("T", " ")}</p>
                                </div>
                            </div>

                            {/* Ownership History */}
                            <div className="detail-section">
                                <h3>📜 Ownership History</h3>
                                <div className="ownership-timeline">
                                    {selectedOrder.ownershipHistory?.map((oh, idx) => (
                                        <div key={oh.id} className={`timeline-item ${idx === selectedOrder.ownershipHistory.length - 1 ? 'current' : ''}`}>
                                            <div className="timeline-marker">
                                                {oh.ownerRole === "FARMER" ? "🌱" : oh.ownerRole === "DISTRIBUTOR" ? "🚚" : "🧑"}
                                            </div>
                                            <div className="timeline-content">
                                                <span className="owner-role-badge">{oh.ownerRole}</span>
                                                <span className="owner-name">{oh.username}</span>
                                                <span className="timeline-time">{oh.timestamp}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipment History */}
                            {selectedOrder.shipmentHistory?.length > 0 && (
                                <div className="detail-section">
                                    <h3>🚚 Shipment Tracking</h3>
                                    <div className="shipment-timeline">
                                        {selectedOrder.shipmentHistory.map(sh => (
                                            <div key={sh.id} className="shipment-entry">
                                                <div className="shipment-icon">📍</div>
                                                <div className="shipment-info">
                                                    <strong>{sh.location}</strong>
                                                    <span className={`status-mini ${getStatusClass(sh.status)}`}>{sh.status}</span>
                                                    <span className="shipment-time">{sh.timestamp?.substring(0, 16).replace("T", " ")}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-danger" onClick={() => setIsDisputeModalOpen(true)}>⚠️ Raise Dispute</button>
                            <button className="btn btn-secondary" onClick={closeOrderDetails}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dispute Modal Overlay */}
            {isDisputeModalOpen && (
                <div className="overlay" style={{ zIndex: 1100 }}>
                    <div className="order-details-modal dispute-modal" style={{ maxWidth: '450px' }}>
                        <button className="modal-close" onClick={() => setIsDisputeModalOpen(false)}>×</button>
                        <div className="modal-header">
                            <h2>⚖️ Raise a Dispute</h2>
                            <p className="text-sm text-gray-500">Tell us what went wrong with Order #{selectedOrder.orderId}</p>
                        </div>
                        <form onSubmit={handleRaiseDispute} className="modal-body">
                            <div className="form-group mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Reason for Dispute</label>
                                <select
                                    className="form-control w-full"
                                    required
                                    value={disputeReason}
                                    onChange={(e) => setDisputeReason(e.target.value)}
                                >
                                    <option value="">Select a reason</option>
                                    <option value="Quality Issue">Quality Issue</option>
                                    <option value="Quantity Mismatch">Quantity Mismatch</option>
                                    <option value="Delivery Delay">Delivery Delay</option>
                                    <option value="Damaged Goods">Damaged Goods</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Description</label>
                                <textarea
                                    className="form-control w-full"
                                    rows="4"
                                    required
                                    placeholder="Please provide more details about the issue..."
                                    value={disputeDescription}
                                    onChange={(e) => setDisputeDescription(e.target.value)}
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setIsDisputeModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmittingDispute}>
                                    {isSubmittingDispute ? "Submitting..." : "Submit Dispute"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
