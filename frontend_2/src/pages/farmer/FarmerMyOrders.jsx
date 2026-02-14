import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProductDetailsModal from "../../components/ProductDetailsModal";
import axios from "../../api/axiosInstance";
import "../../styles/Components.css";

export default function FarmerMyOrders() {
    const farmerId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const status = localStorage.getItem("status");

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchPurchases = useCallback(async () => {
        try {
            const res = await axios.get(`/farmer/purchases/${farmerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Fetched farmer purchases:", res.data);
            setOrders(res.data || []);
            setFilteredOrders(res.data || []);
        } catch (error) {
            console.error("Error fetching purchases:", error);
        }
    }, [farmerId, token]);

    useEffect(() => {
        fetchPurchases();
    }, [fetchPurchases]);

    useEffect(() => {
        const filtered = orders.filter(o =>
            o.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.sellerUsername?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredOrders(filtered);
    }, [searchTerm, orders]);

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeOrderDetails = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    return status === "false" ? (
        <DashboardLayout role="farmer" display={true}>
            <header className="dashboard-header flex justify-between items-center mb-8">
                <div>
                    <h2 className="dashboard-title">My Orders</h2>
                    <p className="text-gray-500 mt-1">Track crops you've purchased from other farmers</p>
                </div>

                <div className="relative w-72">
                    <input
                        type="text"
                        placeholder="Search by crop or seller..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
            </header>

            {filteredOrders.length > 0 ? (
                <div className="order-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map(o => (
                        <div
                            key={o.orderId}
                            className="order-card p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => openOrderDetails(o)}
                        >
                            <div className="relative overflow-hidden rounded-lg mb-4">
                                <img
                                    src={`/uploads/${o.imagePath}`}
                                    alt={o.cropName}
                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${o.orderStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                                    o.orderStatus === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' :
                                        o.orderStatus === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                            'bg-amber-100 text-amber-700'
                                    }`}>
                                    {o.orderStatus}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-lg font-bold text-gray-900">{o.cropName}</h4>
                                    <span className="text-emerald-600 font-bold">₹{o.price}</span>
                                </div>

                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                    <span>👤</span> Seller: <span className="font-medium text-gray-900">{o.sellerUsername}</span>
                                </p>

                                <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-xs text-gray-400">
                                    <span>📅 {o.createdAt?.substring(0, 10)}</span>
                                    <span>Qty: {o.quantity} kg</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 text-lg">No orders found 🌾</p>
                </div>
            )}

            {/* Order Details Modal */}
            <ProductDetailsModal
                isOpen={isModalOpen}
                onClose={closeOrderDetails}
                product={selectedOrder}
                history={selectedOrder?.ownershipHistory}
                shipments={selectedOrder?.shipmentHistory}
            />
        </DashboardLayout>
    ) : (
        <DashboardLayout role="farmer" display={false}>
            <div className="flex flex-col items-center justify-center p-10">
                <h2 className="text-2xl font-bold text-red-600">Access Blocked</h2>
                <p className="text-gray-500">Please contact the administrator.</p>
            </div>
        </DashboardLayout>
    );
}
