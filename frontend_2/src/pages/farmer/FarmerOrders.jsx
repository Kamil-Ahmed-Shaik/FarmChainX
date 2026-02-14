import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProductDetailsModal from "../../components/ProductDetailsModal";
import axios from "../../api/axiosInstance";
import "../../styles/Components.css";

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
};

export default function FarmerOrders() {
  const farmerId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const status = localStorage.getItem("status");

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [farmerLocation, setFarmerLocation] = useState({ lat: null, lng: null });
  const [activeTab, setActiveTab] = useState("PENDING"); // 'PENDING' or 'ACCEPTED'

  // Traceability state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [productForModal, setProductForModal] = useState(null);
  const [ownershipHistory, setOwnershipHistory] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`/farmer/orders/${farmerId}`, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  }, [farmerId, token]);

  useEffect(() => {
    fetchOrders();
    // Get farmer's location for distance calculation
    if (farmerId) {
      axios.get(`/farmer/${farmerId}/profile`).then(res => {
        setFarmerLocation({ lat: res.data.latitude, lng: res.data.longitude });
      });
    }
  }, [fetchOrders, farmerId]);

  useEffect(() => {
    let filtered = orders.filter(o =>
    (o.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.cropName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Filter by tab status
    if (activeTab === "PENDING") {
      filtered = filtered.filter(o => o.status === "PENDING");
    } else {
      // Accepted or Delivered or In Transit
      filtered = filtered.filter(o => o.status === "ACCEPTED" || o.status === "DELIVERED" || o.status === "IN_TRANSIT" || o.status === "SOLD_OUT");
    }

    setFilteredOrders(filtered);
  }, [searchTerm, orders, activeTab]);

  const acceptOrder = async (orderId) => {
    await axios.put(`/farmer/orders/${orderId}/accept`, {}, { headers: { Authorization: `Bearer ${token}` } });
    alert("Order Accepted");
    setSelectedOrder(null);
    fetchOrders();
  };

  const rejectOrder = async (orderId) => {
    await axios.put(`/farmer/orders/${orderId}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } });
    alert("Order Rejected");
    setSelectedOrder(null);
    fetchOrders();
  };

  const openDetailsModal = async (order) => {
    const product = {
      id: order.cropId,
      cropName: order.cropName,
      imagePath: order.imagePath,
      price: order.price,
      quantity: order.quantity,
      qualityGrade: order.qualityGrade,
      username: order.username,
      harvestDate: order.harvestDate,
      location: order.location,
      latitude: order.latitude, // Ensure we pass farm/crop location from crop details if available
      longitude: order.longitude // The DTO might need these. Assuming DTO has crop location or we use farmer location. 
      // Actually order DTO has buyer location. We need Crop location.
      // Assuming farmerLocation is the crop location for now.
    };
    setProductForModal({
      ...product,
      latitude: farmerLocation.lat,
      longitude: farmerLocation.lng
    });

    // Fetch history
    try {
      const historyRes = await axios.get(`/trace/${order.cropId}`);
      setOwnershipHistory(historyRes.data);
    } catch (e) {
      console.error("Error fetching history", e);
      setOwnershipHistory([]);
    }

    setShowDetailsModal(true);
  };

  const getDistance = (order) => {
    return calculateDistance(
      parseFloat(farmerLocation.lat),
      parseFloat(farmerLocation.lng),
      parseFloat(order.buyerLatitude || order.latitude),
      parseFloat(order.buyerLongitude || order.longitude)
    );
  };

  return status === "false" ? (
    <DashboardLayout role="farmer" display={true}>
      <header className="dashboard-header">
        <h2 className="dashboard-title">Orders Management</h2>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          className={`px-6 py-3 font-bold transition-colors border-b-2 ${activeTab === 'PENDING' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('PENDING')}
        >
          New Requests
        </button>
        <button
          className={`px-6 py-3 font-bold transition-colors border-b-2 ${activeTab === 'ACCEPTED' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('ACCEPTED')}
        >
          Accepted Orders
        </button>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="🔍 Search by name or crop..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="order-grid">
        {filteredOrders.length > 0 ? filteredOrders.map(o => (
          <div key={o.id} className="order-card" onClick={() => setSelectedOrder(o)}>
            <img src={`/uploads/${o.imagePath}`} alt="crop" />
            <h4>{o.username}</h4>
            <p><b>{o.cropName}</b></p>
            <p><span className={`status-badge ${o.status === 'ACCEPTED' ? 'status-valid' : o.status === 'REJECTED' ? 'status-rejected' : 'status-pending'}`}>{o.status}</span></p>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Ordered: {o.createdAt?.substring(0, 10)}</p>
          </div>
        )) : (
          <div className="col-span-full text-center py-10 text-gray-400">
            No {activeTab.toLowerCase().replace('_', ' ')} orders found.
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="overlay">
          <div className="overlay-box">
            <button className="overlay-close" onClick={() => setSelectedOrder(null)}>X</button>
            <div className="overlay-content">
              {/* LEFT - Buyer Details */}
              <div className="overlay-section">
                <h3>👤 Buyer Details</h3>
                <p><b>Role:</b> {selectedOrder.role}</p>
                <p><b>Name:</b> {selectedOrder.username}</p>
                {selectedOrder.role === "DISTRIBUTOR" && (
                  <><p><b>Company:</b> {selectedOrder.companyName}</p><p><b>Region:</b> {selectedOrder.region}</p></>
                )}
                {selectedOrder.role === "RETAILER" && (
                  <><p><b>Shop:</b> {selectedOrder.shopName}</p><p><b>Location:</b> {selectedOrder.location}</p></>
                )}
                {selectedOrder.role === "CONSUMER" && (
                  <><p><b>Address:</b> {selectedOrder.location}</p></>
                )}

                <h4 style={{ marginTop: '1.5rem' }}>📍 Buyer Location</h4>
                <p><b>Latitude:</b> {selectedOrder.buyerLatitude || selectedOrder.latitude || "N/A"}</p>
                <p><b>Longitude:</b> {selectedOrder.buyerLongitude || selectedOrder.longitude || "N/A"}</p>

                <div style={{ marginTop: '1rem', padding: '1rem', background: '#d1fae5', borderRadius: '0.5rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.875rem', color: '#065f46' }}>🚛 Transport Distance</p>
                  <p style={{ fontSize: '1.5rem', fontWeight: '800', color: '#047857' }}>
                    {getDistance(selectedOrder) ? `${getDistance(selectedOrder)} km` : "Location not available"}
                  </p>
                </div>

                <h4 style={{ marginTop: '1rem' }}>📦 Order Info</h4>
                <p><b>Status:</b> <span className={`status-badge ${selectedOrder.status === 'ACCEPTED' ? 'status-valid' : 'status-pending'}`}>{selectedOrder.status}</span></p>
                <p><b>Order Date:</b> {selectedOrder.createdAt}</p>
              </div>

              {/* RIGHT - Map */}
              <div className="overlay-section">
                <h3>🗺️ Locations Map</h3>
                <div className="map-container">
                  <iframe title="map" src={`https://maps.google.com/maps?q=${selectedOrder.buyerLatitude || selectedOrder.latitude},${selectedOrder.buyerLongitude || selectedOrder.longitude}&z=12&output=embed`}></iframe>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <h4>🌾 Your Farm</h4>
                  <p><b>Lat:</b> {farmerLocation.lat || "N/A"} | <b>Lng:</b> {farmerLocation.lng || "N/A"}</p>

                  <h4 style={{ marginTop: '0.5rem' }}>🏢 Buyer</h4>
                  <p><b>Lat:</b> {selectedOrder.buyerLatitude || selectedOrder.latitude || "N/A"} | <b>Lng:</b> {selectedOrder.buyerLongitude || selectedOrder.longitude || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="overlay-footer">
              <div style={{ marginRight: 'auto' }}>
                <button className="btn btn-secondary" onClick={() => openDetailsModal(selectedOrder)}>📜 View Crop History & QR</button>
              </div>

              {selectedOrder.status === 'PENDING' && (
                <>
                  <button className="btn btn-danger" onClick={() => rejectOrder(selectedOrder.id)}>❌ Reject</button>
                  <button className="btn btn-success" onClick={() => acceptOrder(selectedOrder.id)}>✅ Accept</button>
                </>
              )}
              <button className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details & Traceability Modal */}
      <ProductDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        product={productForModal}
        history={ownershipHistory}
      />
    </DashboardLayout>
  ) : (
    <DashboardLayout role="farmer" display={false}>
      <h2>Blocked</h2>
      <p>You are blocked by admin</p>
    </DashboardLayout>
  );
}
