import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProductDetailsModal from "../../components/ProductDetailsModal";
import ModernProductCard from "../../components/common/ModernProductCard";
import axios from "../../api/axiosInstance";
import "../../styles/Components.css";
import "../../styles/RetailerProducts.css";

export default function RetailerProducts() {
    const retailerId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const status = localStorage.getItem("status");

    const [products, setProducts] = useState([]);
    const [distributors, setDistributors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Order form state
    const [orderForm, setOrderForm] = useState({
        distributorId: "",
        address: "",
        phone: ""
    });
    const [submitting, setSubmitting] = useState(false);

    const fetchProducts = useCallback(async () => {
        try {
            const res = await axios.get(`/retailer/marketplace/${retailerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const fetchDistributors = useCallback(async () => {
        try {
            const res = await axios.get("/retailer/distributors", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDistributors(res.data);
        } catch (error) {
            console.error("Error fetching distributors:", error);
        }
    }, [token]);

    useEffect(() => {
        fetchProducts();
        fetchDistributors();
    }, [fetchProducts, fetchDistributors]);

    const openBuyModal = (product) => {
        setSelectedProduct(product);
        setOrderForm({ distributorId: "", address: "", phone: "" });
        setShowBuyModal(true);
    };

    const closeBuyModal = () => {
        setShowBuyModal(false);
        setSelectedProduct(null);
        setOrderForm({ distributorId: "", address: "", phone: "" });
    };

    const openDetailsModal = (product) => {
        setSelectedProduct(product);
        setShowDetailsModal(true);
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        if (!orderForm.distributorId || !orderForm.address || !orderForm.phone) {
            alert("Please fill all fields");
            return;
        }

        setSubmitting(true);
        try {
            await axios.post("/retailer/order", {
                cropId: selectedProduct.id,
                farmerId: selectedProduct.farmerId,
                retailerId: parseInt(retailerId),
                distributorId: parseInt(orderForm.distributorId),
                address: orderForm.address,
                phone: orderForm.phone
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("🎉 Order placed successfully! The farmer will review your order.");
            closeBuyModal();
            fetchProducts();
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return status === "false" ? (
        <DashboardLayout role="retailer" display={true}>
            <header className="dashboard-header">
                <h2 className="dashboard-title">🛒 Marketplace</h2>
                <p className="dashboard-subtitle">Browse and purchase verified crops directly from farmers</p>
            </header>

            <div className="marketplace-container">
                <div className="marketplace-header">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="🔍 Search crops or farmers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading marketplace...</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <ModernProductCard
                                key={product.id}
                                product={product}
                                onDetailsClick={openDetailsModal}
                                onBuyClick={openBuyModal}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Buy Now Modal */}
            {
                showBuyModal && selectedProduct && (
                    <div className="overlay">
                        <div className="buy-modal">
                            <button className="modal-close" onClick={closeBuyModal}>×</button>
                            <div className="modal-header">
                                <h2>🛒 Place Order</h2>
                            </div>
                            <div className="modal-body">
                                <div className="order-product-summary">
                                    <img src={`/uploads/${selectedProduct.imagePath}`} alt={selectedProduct.cropName} />
                                    <div className="summary-info">
                                        <h3>{selectedProduct.cropName}</h3>
                                        <p><b>Farmer:</b> {selectedProduct.username}</p>
                                        <p><b>Quantity:</b> {selectedProduct.quantity} kg</p>
                                        <p><b>Price:</b> <span className="price-highlight">₹{selectedProduct.price}</span></p>
                                        <p><b>Quality:</b> {selectedProduct.qualityGrade}</p>
                                    </div>
                                </div>
                                <form onSubmit={handleOrderSubmit} className="order-form">
                                    <div className="form-group">
                                        <label>🚚 Select Distributor</label>
                                        <select
                                            value={orderForm.distributorId}
                                            onChange={(e) => setOrderForm({ ...orderForm, distributorId: e.target.value })}
                                            required
                                        >
                                            <option value="">-- Choose a distributor --</option>
                                            {distributors.map(d => (
                                                <option key={d.distributorId} value={d.distributorId}>
                                                    #{d.distributorId} - {d.companyName} ({d.region})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>📍 Delivery Address</label>
                                        <textarea
                                            value={orderForm.address}
                                            onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                                            placeholder="Enter your complete delivery address..."
                                            rows="3"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label>📞 Contact Phone</label>
                                        <input
                                            type="tel"
                                            value={orderForm.phone}
                                            onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                    </div>
                                    <div className="modal-actions">
                                        <button type="button" className="btn btn-secondary" onClick={closeBuyModal}>Cancel</button>
                                        <button type="submit" className="btn btn-success" disabled={submitting}>
                                            {submitting ? "Placing Order..." : "✓ Confirm Order"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Product Details & Traceability Modal */}
            <ProductDetailsModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                product={selectedProduct}
            />
        </DashboardLayout >
    ) : (
        <DashboardLayout role="retailer" display={false}>
            <h2>Blocked</h2>
            <p>You are blocked by admin</p>
        </DashboardLayout>
    );
}
