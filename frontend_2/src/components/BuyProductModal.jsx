import React, { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import '../styles/Components.css';

export default function BuyProductModal({ isOpen, onClose, product, userRole, onOrderSuccess }) {
    const [distributors, setDistributors] = useState([]);
    const [formData, setFormData] = useState({
        distributorId: "",
        address: "",
        phone: ""
    });
    const [loading, setLoading] = useState(false);
    const [fetchingDistributors, setFetchingDistributors] = useState(true);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    // Fetch distributors based on user role
    useEffect(() => {
        if (isOpen) {
            const fetchDistributors = async () => {
                try {
                    // Use appropriate endpoint based on role
                    const endpoint = userRole === 'farmer' ? '/farmer/distributors' :
                        userRole === 'retailer' ? '/retailer/distributors' :
                            '/consumer/distributors';

                    const res = await axios.get(endpoint, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setDistributors(res.data);
                } catch (error) {
                    console.error("Error fetching distributors:", error);
                } finally {
                    setFetchingDistributors(false);
                }
            };

            fetchDistributors();
            // Reset form on open
            setFormData({ distributorId: "", address: "", phone: "" });
        }
    }, [isOpen, userRole, token]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.distributorId || !formData.address || !formData.phone) {
            alert("Please fill all fields");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                cropId: product.id,
                farmerId: product.farmerId,
                distributorId: parseInt(formData.distributorId),
                address: formData.address,
                phone: formData.phone
            };

            // Add appropriate buyer ID field
            if (userRole === 'farmer') payload.buyerId = parseInt(userId);
            else if (userRole === 'retailer') payload.retailerId = parseInt(userId);
            else payload.consumerId = parseInt(userId);

            const endpoint = userRole === 'farmer' ? '/farmer/order' :
                userRole === 'retailer' ? '/retailer/order' :
                    '/consumer/order';

            await axios.post(endpoint, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("🎉 Order placed successfully! The farmer will review your order.");
            if (onOrderSuccess) onOrderSuccess();
            onClose();
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !product) return null;

    return (
        <div className="overlay">
            <div className="modal-box" style={{ maxWidth: '600px', width: '90%' }}>
                <button className="modal-close" onClick={onClose}>×</button>
                <div className="modal-header">
                    <h2>🛒 Place Order</h2>
                </div>

                <div className="modal-body">
                    {/* Product Summary */}
                    <div className="flex gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <img
                            src={`/uploads/${product.imagePath}`}
                            alt={product.cropName}
                            className="w-20 h-20 object-cover rounded-lg shadow-sm"
                        />
                        <div>
                            <h3 className="text-lg font-bold">{product.cropName}</h3>
                            <p className="text-sm text-gray-600">Farmer: {product.username}</p>
                            <p className="text-sm text-gray-600">Qty: {product.quantity} kg | Grade: {product.qualityGrade}</p>
                            <p className="text-emerald-600 font-bold">Price: ₹{product.price}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-group">
                            <label>🚚 Select Distributor</label>
                            {fetchingDistributors ? (
                                <p className="text-sm text-gray-500">Loading distributors...</p>
                            ) : (
                                <select
                                    value={formData.distributorId}
                                    onChange={(e) => setFormData({ ...formData, distributorId: e.target.value })}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                >
                                    <option value="">-- Choose a distributor --</option>
                                    {distributors.map(d => (
                                        <option key={d.distributorId} value={d.distributorId}>
                                            {d.companyName} ({d.region})
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="form-group">
                            <label>📍 Delivery Address</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Enter complete delivery address"
                                className="w-full p-2 border rounded-lg"
                                rows="2"
                                required
                            ></textarea>
                        </div>

                        <div className="form-group">
                            <label>📞 Contact Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Enter phone number"
                                className="w-full p-2 border rounded-lg"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-success" disabled={loading}>
                                {loading ? "Processing..." : "Confirm & Pay"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
