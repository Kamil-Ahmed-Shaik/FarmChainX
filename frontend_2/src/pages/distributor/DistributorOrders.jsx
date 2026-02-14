import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProductDetailsModal from "../../components/ProductDetailsModal";
import axios from "../../api/axiosInstance";
import "../../styles/Components.css";
import "../../styles/RetailerProducts.css"; // Reusing enhanced card styles

export default function DistributorOrders() {
    const distributorId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const fetchMyOrders = useCallback(async () => {
        try {
            const res = await axios.get(`/distributor/myorders/${distributorId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching my orders:", error);
        } finally {
            setLoading(false);
        }
    }, [distributorId, token]);

    useEffect(() => {
        if (distributorId) {
            fetchMyOrders();
        }
    }, [fetchMyOrders, distributorId]);

    const openDetailsModal = (product) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
    };

    const filteredProducts = products.filter(p =>
        p.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="distributor" display={true}>
            <header className="dashboard-header">
                <h2 className="dashboard-title">📦 My Purchases</h2>
                <p className="dashboard-subtitle">Track your purchased crops and shipments</p>
            </header>

            <div className="marketplace-container">
                <div className="marketplace-header">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="🔍 Search my orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="marketplace-stats">
                        <span className="stat-item">
                            <span className="stat-icon">📄</span>
                            <span className="stat-value">{products.length}</span>
                            <span className="stat-label">Total Orders</span>
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading your orders...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="no-products">
                        <span className="no-products-icon">📦</span>
                        <h3>No orders found</h3>
                        <p>You haven't purchased any crops yet.</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="product-card-enhanced" style={{ borderColor: '#2563eb' }}>
                                <div className="product-image-wrapper">
                                    <img src={`/uploads/${product.imagePath}`} alt={product.cropName} />
                                    <div className="product-badge verified" style={{ background: '#2563eb' }}>{product.status}</div>
                                    <div className="product-grade">{product.qualityGrade}</div>
                                </div>
                                <div className="product-content">
                                    <h3 className="product-name">{product.cropName}</h3>
                                    <div className="product-farmer">
                                        <span className="farmer-icon">👨‍🌾</span>
                                        <span>From: {product.username}</span>
                                    </div>
                                    <div className="product-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Quantity</span>
                                            <span className="detail-value">{product.quantity} kg</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Total Cost</span>
                                            <span className="detail-value price" style={{ color: '#2563eb' }}>₹{product.price}</span>
                                        </div>
                                    </div>
                                    <div className="product-meta">
                                        <span>📅 Ordered: {new Date(product.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-2" style={{ marginTop: '1rem' }}>
                                        <button
                                            className="btn btn-sm btn-secondary w-full"
                                            onClick={() => openDetailsModal(product)}
                                        >
                                            🔍 View Details & Trace
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
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
    );
}