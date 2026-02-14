import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import ProductDetailsModal from "../../components/ProductDetailsModal";
import "../../styles/Components.css";
import "../../styles/RetailerProducts.css";

export default function RetailerStorage() {
    const retailerId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const status = localStorage.getItem("status");

    const [acceptedOrders, setAcceptedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [history, setHistory] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Price update state
    const [showPriceModal, setShowPriceModal] = useState(false);
    const [selectedForPricing, setSelectedForPricing] = useState(null);
    const [newPrice, setNewPrice] = useState("");
    const [updating, setUpdating] = useState(false);

    const fetchAcceptedOrders = useCallback(async () => {
        try {
            const res = await axios.get(`/retailer/orders/${retailerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Filter only APPROVED/COMPLETED/DELIVERED orders
            const accepted = res.data.filter(order =>
                order.orderStatus === "APPROVED" ||
                order.orderStatus === "COMPLETED" ||
                order.orderStatus === "DELIVERED"
            );
            setAcceptedOrders(accepted);
        } catch (error) {
            console.error("Error fetching accepted orders:", error);
        } finally {
            setLoading(false);
        }
    }, [retailerId, token]);

    useEffect(() => {
        fetchAcceptedOrders();
    }, [fetchAcceptedOrders]);

    const fetchCropDetails = async (cropId) => {
        setLoadingDetails(true);
        try {
            // Fetch ownership history
            const historyRes = await axios.get(`/trace/${cropId}`);
            setHistory(historyRes.data || []);

            // Fetch shipment history if order has shipments
            // We'll try to fetch from the order's shipment data
            setShipments([]); // Will be populated from order details if available
        } catch (error) {
            console.error("Error fetching crop details:", error);
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleCropClick = async (order) => {
        setSelectedCrop({
            ...order,
            id: order.cropId,
            name: order.cropName,
            imagePath: order.imagePath,
            qualityGrade: order.qualityGrade,
            quantity: order.quantity,
            price: order.price,
            harvestDate: order.harvestDate,
            blockchainHash: order.blockchainHash,
            farmLocation: order.farmLocation,
            farmerUsername: order.farmerUsername,
            farmName: order.farmName,
            cropStatus: order.orderStatus
        });
        await fetchCropDetails(order.cropId);
        setShipments(order.shipmentHistory || []);
        setShowDetailsModal(true);
    };

    const openPriceUpdateModal = (order) => {
        // Only allow price update if not published yet
        if (order.cropStatus === "PUBLISHED") {
            alert("Cannot update price after publishing!");
            return;
        }
        setSelectedForPricing(order);
        setNewPrice(order.price || "");
        setShowPriceModal(true);
    };

    const handleUpdatePrice = async (e) => {
        e.preventDefault();
        if (!newPrice || isNaN(newPrice) || parseFloat(newPrice) <= 0) {
            alert("Please enter a valid price");
            return;
        }

        setUpdating(true);
        try {
            await axios.post(`/retailer/update-price`, {
                cropId: selectedForPricing.cropId,
                newPrice: parseFloat(newPrice)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("✅ Price updated successfully!");
            setShowPriceModal(false);
            setSelectedForPricing(null);
            setNewPrice("");
            fetchAcceptedOrders();
        } catch (error) {
            console.error("Error updating price:", error);
            alert("Failed to update price. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    const handlePublishCrop = async (order) => {
        if (window.confirm(`Publish "${order.cropName}" to consumer marketplace? Price will be locked after publishing.`)) {
            try {
                await axios.post(`/retailer/publish-crop`, {
                    cropId: order.cropId
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("✅ Crop published successfully! Now available to consumers.");
                fetchAcceptedOrders();
            } catch (error) {
                console.error("Error publishing crop:", error);
                alert("Failed to publish crop. Please try again.");
            }
        }
    };

    return status === "false" ? (
        <DashboardLayout role="retailer" display={true}>
            <header className="dashboard-header">
                <h2 className="dashboard-title">📦 My Storage</h2>
                <p className="dashboard-subtitle">Manage your accepted orders, update prices, and publish to consumers</p>
            </header>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading storage...</p>
                </div>
            ) : acceptedOrders.length === 0 ? (
                <div className="no-products">
                    <span className="no-products-icon">📦</span>
                    <h3>No crops in storage</h3>
                    <p>Accepted farmer orders will appear here</p>
                </div>
            ) : (
                <div className="products-grid">
                    {acceptedOrders.map(order => (
                        <div key={order.orderId} className="product-card-enhanced">
                            <div className="product-image-wrapper" onClick={() => handleCropClick(order)}>
                                <img src={`/uploads/${order.imagePath}`} alt={order.cropName} />
                                <div className="product-badge verified">✓ Accepted</div>
                                <div className="product-grade">{order.qualityGrade}</div>
                                {order.cropStatus === "PUBLISHED" && (
                                    <div className="product-badge" style={{ top: '3rem', background: '#3b82f6' }}>
                                        📱 Published
                                    </div>
                                )}
                            </div>
                            <div className="product-content">
                                <h3 className="product-name">{order.cropName}</h3>
                                <div className="product-farmer">
                                    <span className="farmer-icon">👨‍🌾</span>
                                    <span>{order.farmerUsername}</span>
                                </div>
                                <div className="product-details">
                                    <div className="detail-item">
                                        <span className="detail-label">Quantity</span>
                                        <span className="detail-value">{order.quantity} kg</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Price</span>
                                        <span className="detail-value price">₹{order.price}</span>
                                    </div>
                                </div>
                                <div className="product-meta">
                                    <span>📅 {order.harvestDate}</span>
                                    <span className={`status-badge status-${order.orderStatus?.toLowerCase()}`}>
                                        {order.orderStatus}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => handleCropClick(order)}
                                        style={{ flex: 1 }}
                                    >
                                        📜 Details
                                    </button>
                                    {order.cropStatus !== "PUBLISHED" ? (
                                        <>
                                            <button
                                                className="btn btn-sm"
                                                onClick={() => openPriceUpdateModal(order)}
                                                style={{ flex: 1, background: '#f59e0b', color: 'white' }}
                                            >
                                                💰 Update Price
                                            </button>
                                            <button
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handlePublishCrop(order)}
                                                style={{ flex: 1 }}
                                            >
                                                📱 Publish
                                            </button>
                                        </>
                                    ) : (
                                        <div style={{
                                            flex: 2,
                                            background: '#dbeafe',
                                            color: '#1e40af',
                                            padding: '0.5rem',
                                            borderRadius: '0.5rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            textAlign: 'center'
                                        }}>
                                            🔒 Published - Price Locked
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Product Details Modal */}
            {showDetailsModal && selectedCrop && (
                <ProductDetailsModal
                    product={selectedCrop}
                    onClose={() => setShowDetailsModal(false)}
                    history={history}
                    shipments={shipments}
                />
            )}

            {/* Price Update Modal */}
            {showPriceModal && selectedForPricing && (
                <div className="overlay">
                    <div className="buy-modal" style={{ maxWidth: '400px' }}>
                        <button className="modal-close" onClick={() => setShowPriceModal(false)}>×</button>

                        <div className="modal-header">
                            <h2>💰 Update Price</h2>
                        </div>

                        <div className="modal-body">
                            <div style={{
                                background: '#fef3c7',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                marginBottom: '1rem',
                                fontSize: '0.875rem',
                                color: '#92400e'
                            }}>
                                ⚠️ <b>Note:</b> Price can only be updated BEFORE publishing. Once published, price is locked.
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <p><b>Crop:</b> {selectedForPricing.cropName}</p>
                                <p><b>Current Price:</b> ₹{selectedForPricing.price}</p>
                                <p><b>Quantity:</b> {selectedForPricing.quantity} kg</p>
                            </div>

                            <form onSubmit={handleUpdatePrice}>
                                <div className="form-group">
                                    <label>New Price (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newPrice}
                                        onChange={(e) => setNewPrice(e.target.value)}
                                        placeholder="Enter new price"
                                        required
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowPriceModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-success" disabled={updating}>
                                        {updating ? "Updating..." : "✓ Update Price"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    ) : (
        <DashboardLayout role="retailer" display={false}>
            <h2>Blocked</h2>
            <p>You are blocked by admin</p>
        </DashboardLayout>
    );
}
