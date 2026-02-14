import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProductDetailsModal from "../../components/ProductDetailsModal";
import axios from "../../api/axiosInstance";
import QualityGrade from "../../components/ai/QualityGrade";
import ModernProductCard from "../../components/common/ModernProductCard";
import "../../styles/Components.css";
import "../../styles/ConsumerProducts.css";

export default function ConsumerProducts() {
    const consumerId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

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

    const [consumerLocation, setConsumerLocation] = useState(null);

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return null;
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(1);
    };

    const fetchConsumerLocation = useCallback(async () => {
        try {
            // First try to get from profile
            const res = await axios.get(`/consumer/profile/${consumerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.latitude && res.data.longitude) {
                setConsumerLocation({ lat: res.data.latitude, lng: res.data.longitude });
            } else {
                // Fallback to browser geolocation
                navigator.geolocation.getCurrentPosition((pos) => {
                    setConsumerLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                }, (err) => console.log("Geolocation blocked/failed", err));
            }
        } catch (e) {
            console.error("Error fetching profile for location", e);
            navigator.geolocation.getCurrentPosition((pos) => {
                setConsumerLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            }, (err) => console.log("Geolocation blocked/failed", err));
        }
    }, [consumerId, token]);

    const fetchProducts = useCallback(async () => {
        try {
            const res = await axios.get(`/consumer/marketplace/${consumerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [token, consumerId]);

    const fetchDistributors = useCallback(async () => {
        try {
            const res = await axios.get("/consumer/distributors", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDistributors(res.data);
        } catch (error) {
            console.error("Error fetching distributors:", error);
        }
    }, [token]);

    useEffect(() => {
        fetchConsumerLocation();
        fetchProducts();
        fetchDistributors();
    }, [fetchProducts, fetchDistributors, fetchConsumerLocation]);

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
            await axios.post("/consumer/order", {
                cropId: selectedProduct.id,
                farmerId: selectedProduct.farmerId,
                consumerId: parseInt(consumerId),
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

    const productsWithDistance = products.map(p => ({
        ...p,
        distance: consumerLocation ? calculateDistance(consumerLocation.lat, consumerLocation.lng, p.latitude, p.longitude) : null
    }));

    const filteredProducts = productsWithDistance.filter(p =>
        p.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get nearest 3 products for sidebar
    const nearbyProducts = [...productsWithDistance]
        .filter(p => p.distance !== null)
        .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        .slice(0, 3);

    return (
        <DashboardLayout role="consumer" display={true}>
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Farm <span className="text-emerald-600">Market</span></h2>
                    <p className="text-gray-500 font-medium">Blockchain verified fresh produce</p>
                </div>
                <div className="flex-1 max-w-md mx-4">
                    <input
                        type="text"
                        placeholder="Search crops or farmers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    />
                </div>
            </header>

            <section className="mb-12">
                <div className="p-8 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="relative z-10 text-center md:text-left">
                        <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">Personalized For You</span>
                        <h3 className="text-3xl font-black mb-2">You usually buy Organic Tomatoes</h3>
                        <p className="text-emerald-100 font-medium">We've found {nearbyProducts.length > 0 ? nearbyProducts.length : '3'} local farmers with fresh harvests this morning. Check them out!</p>
                    </div>
                    <div className="flex-shrink-0 relative z-10">
                        <button className="px-8 py-4 bg-white text-emerald-700 rounded-2xl font-bold shadow-lg hover:scale-105 transition">Explore Picks</button>
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 mb-12">
                <div className="xl:col-span-4">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-80 bg-gray-100 rounded-3xl"></div>)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-6">
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
                    {filteredProducts.length === 0 && !loading && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <span className="text-6xl mb-4 block">🌱</span>
                            <h3 className="text-2xl font-bold text-gray-900">No products found</h3>
                            <p className="text-gray-500">Try searching for something else or check back later.</p>
                        </div>
                    )}
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 h-full">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">📍 Local Harvests</h3>
                    <div className="space-y-6">
                        {nearbyProducts.length > 0 ? nearbyProducts.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition" onClick={() => openDetailsModal(item)}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 ${idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-blue-500' : 'bg-purple-500'} rounded-full`}></div>
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-emerald-600 transition">{item.cropName}</span>
                                </div>
                                <span className="text-xs font-black text-gray-300">{item.distance} km</span>
                            </div>
                        )) : (
                            <p className="text-gray-400">No active harvests nearby.</p>
                        )}
                    </div>
                </div>
                <div className="h-full">
                    <QualityGrade />
                </div>
            </div>

            {/* Buy Now Modal */}
            {
                showBuyModal && selectedProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-fade-in">
                        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
                            <div className="relative h-4 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-8">
                                    <h2 className="text-3xl font-black text-gray-900">Place Your Order</h2>
                                    <button className="text-3xl text-gray-300 hover:text-red-500 transition" onClick={closeBuyModal}>×</button>
                                </div>

                                <div className="flex gap-6 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <img className="w-24 h-24 object-cover rounded-xl shadow-sm" src={`/uploads/${selectedProduct.imagePath}`} alt={selectedProduct.cropName} />
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900">{selectedProduct.cropName}</h3>
                                        <div className="grid grid-cols-2 gap-y-2 mt-2">
                                            <p className="text-xs text-gray-700"><b>Farmer:</b> {selectedProduct.username}</p>
                                            <p className="text-xs text-gray-700"><b>Quantity:</b> {selectedProduct.quantity} kg</p>
                                            <p className="text-xs text-gray-700"><b>Grade:</b> {selectedProduct.qualityGrade}</p>
                                            <p className="text-xs text-emerald-600 font-bold"><b>Price:</b> ₹{selectedProduct.price}</p>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleOrderSubmit} className="space-y-6">
                                    <div>
                                        <label className="text-sm font-bold text-gray-400 block mb-2 uppercase tracking-wider">Select Distributor</label>
                                        <select
                                            value={orderForm.distributorId}
                                            onChange={(e) => setOrderForm({ ...orderForm, distributorId: e.target.value })}
                                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                                            required
                                        >
                                            <option value="">Choose nearest distributor...</option>
                                            {distributors.map(d => (
                                                <option key={d.distributorId} value={d.distributorId}>
                                                    {d.companyName} - {d.region}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-gray-400 block mb-2 uppercase tracking-wider">Delivery Details</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <textarea
                                                value={orderForm.address}
                                                onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                                                placeholder="Full address..."
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition md:col-span-2"
                                                rows="2"
                                                required
                                            ></textarea>
                                            <input
                                                type="tel"
                                                value={orderForm.phone}
                                                onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                                                placeholder="Phone number"
                                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                                                required
                                            />
                                            <button type="submit" className="w-full p-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-emerald-600 transition shadow-xl" disabled={submitting}>
                                                {submitting ? "Processing..." : "Confirm & Pay"}
                                            </button>
                                        </div>
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
    );
}
