import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import "../../styles/Components.css";
import "../../styles/DistributorInventory.css";

export default function DistributorInventory() {
  const distributorId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const status = localStorage.getItem("status");

  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("RECEIVED");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showShipmentModal, setShowShipmentModal] = useState(false);

  // Shipment form state
  const [shipmentForm, setShipmentForm] = useState({
    location: "",
    status: "IN_TRANSIT",
    conditionData: "",
    latitude: "",
    longitude: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchInventory = useCallback(async () => {
    try {
      const res = await axios.get(`/distributor/inventory/${distributorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventory(res.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  }, [distributorId, token]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const getTabOrders = (tab) => {
    return inventory.filter(item => item.tabCategory === tab);
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const openShipmentModal = (order) => {
    setSelectedOrder(order);
    setShipmentForm({
      location: "",
      status: "IN_TRANSIT",
      conditionData: "",
      latitude: "",
      longitude: ""
    });
    setShowShipmentModal(true);
  };

  const closeShipmentModal = () => {
    setShowShipmentModal(false);
    setSelectedOrder(null);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setShipmentForm({
            ...shipmentForm,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get current location. Please enter manually.");
        }
      );
    }
  };

  const handleShipmentSubmit = async (e) => {
    e.preventDefault();
    if (!shipmentForm.location) {
      alert("Please enter the current location");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`/distributor/shipment/${selectedOrder.orderId}`, {
        location: shipmentForm.location,
        status: shipmentForm.status,
        conditionData: shipmentForm.conditionData,
        latitude: parseFloat(shipmentForm.latitude) || 0,
        longitude: parseFloat(shipmentForm.longitude) || 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Shipment update added successfully!");
      closeShipmentModal();
      fetchInventory();
    } catch (error) {
      console.error("Error adding shipment update:", error);
      alert("Failed to add shipment update. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const markAsDelivered = async (orderId) => {
    if (!window.confirm("Are you sure you want to mark this order as delivered? This will transfer ownership to the retailer.")) {
      return;
    }

    try {
      await axios.put(`/distributor/deliver/${orderId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("📦 Order marked as delivered! Ownership has been transferred to the retailer.");
      fetchInventory();
    } catch (error) {
      console.error("Error marking as delivered:", error);
      alert("Failed to mark as delivered. Please try again.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "ACCEPTED": return "status-accepted";
      case "IN_TRANSIT": return "status-transit";
      case "DELIVERED": return "status-delivered";
      default: return "";
    }
  };

  const tabCounts = {
    RECEIVED: getTabOrders("RECEIVED").length,
    IN_TRANSIT: getTabOrders("IN_TRANSIT").length,
    DELIVERED: getTabOrders("DELIVERED").length
  };

  return status === "false" ? (
    <DashboardLayout role="distributor" display={true}>
      <header className="dashboard-header">
        <h2 className="dashboard-title">📦 Inventory Management</h2>
        <p className="dashboard-subtitle">Manage shipments and track deliveries</p>
      </header>

      <div className="inventory-container">
        {/* Tab Navigation */}
        <div className="inventory-tabs">
          <button
            className={`inventory-tab ${activeTab === 'RECEIVED' ? 'active' : ''} received`}
            onClick={() => setActiveTab('RECEIVED')}
          >
            <span className="tab-icon">📥</span>
            <span className="tab-label">Received</span>
            <span className="tab-badge">{tabCounts.RECEIVED}</span>
          </button>
          <button
            className={`inventory-tab ${activeTab === 'IN_TRANSIT' ? 'active' : ''} transit`}
            onClick={() => setActiveTab('IN_TRANSIT')}
          >
            <span className="tab-icon">🚚</span>
            <span className="tab-label">In Transit</span>
            <span className="tab-badge">{tabCounts.IN_TRANSIT}</span>
          </button>
          <button
            className={`inventory-tab ${activeTab === 'DELIVERED' ? 'active' : ''} delivered`}
            onClick={() => setActiveTab('DELIVERED')}
          >
            <span className="tab-icon">✅</span>
            <span className="tab-label">Delivered</span>
            <span className="tab-badge">{tabCounts.DELIVERED}</span>
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading inventory...</p>
          </div>
        ) : (
          <div className="inventory-content">
            {getTabOrders(activeTab).length === 0 ? (
              <div className="no-items">
                <span className="no-items-icon">
                  {activeTab === 'RECEIVED' ? '📥' : activeTab === 'IN_TRANSIT' ? '🚚' : '✅'}
                </span>
                <h3>No orders in this category</h3>
                <p>Orders will appear here when their status changes.</p>
              </div>
            ) : (
              <div className="inventory-grid">
                {getTabOrders(activeTab).map(item => (
                  <div key={item.orderId} className={`inventory-card ${activeTab.toLowerCase().replace('_', '-')}`}>
                    <div className="inventory-card-header">
                      <span className="order-number">Order #{item.orderId}</span>
                      <span className={`status-badge ${getStatusClass(item.orderStatus)}`}>
                        {item.orderStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="inventory-card-body">
                      <div className="product-preview">
                        <img src={`/uploads/${item.imagePath}`} alt={item.cropName} />
                        <div className="product-info">
                          <h4>{item.cropName}</h4>
                          <p>{item.quantity} kg • ₹{item.price}</p>
                          <p className="quality">{item.qualityGrade}</p>
                        </div>
                      </div>

                      <div className="route-info">
                        <div className="route-point from">
                          <span className="point-icon">🌾</span>
                          <div className="point-details">
                            <small>From (Farmer)</small>
                            <strong>{item.farmerUsername}</strong>
                            <span>{item.farmLocation?.substring(0, 25)}...</span>
                          </div>
                        </div>
                        <div className="route-arrow">→</div>
                        <div className="route-point to">
                          <span className="point-icon">🏪</span>
                          <div className="point-details">
                            <small>To (Retailer)</small>
                            <strong>{item.retailerUsername}</strong>
                            <span>{item.retailerLocation?.substring(0, 25)}...</span>
                          </div>
                        </div>
                      </div>

                      <div className="shipment-progress">
                        <div className="progress-label">Shipment Updates</div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${Math.min((item.shipmentCount || 0) * 25, 100)}%` }}
                          ></div>
                        </div>
                        <span className="shipment-count">{item.shipmentCount || 0} updates</span>
                      </div>
                    </div>

                    <div className="inventory-card-actions">
                      <button className="btn btn-info" onClick={() => openOrderDetails(item)}>
                        📋 Details
                      </button>

                      {activeTab === 'RECEIVED' && (
                        <button className="btn btn-primary" onClick={() => openShipmentModal(item)}>
                          🚚 Start Shipment
                        </button>
                      )}

                      {activeTab === 'IN_TRANSIT' && (
                        <>
                          <button className="btn btn-secondary" onClick={() => openShipmentModal(item)}>
                            📍 Update Location
                          </button>
                          <button className="btn btn-success" onClick={() => markAsDelivered(item.orderId)}>
                            ✅ Mark Delivered
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && !showShipmentModal && (
        <div className="overlay">
          <div className="details-modal">
            <button className="modal-close" onClick={closeOrderDetails}>×</button>

            <div className="modal-header">
              <h2>📋 Order #{selectedOrder.orderId} Details</h2>
              <span className={`status-badge large ${getStatusClass(selectedOrder.orderStatus)}`}>
                {selectedOrder.orderStatus.replace('_', ' ')}
              </span>
            </div>

            <div className="modal-body">
              {/* Product Info */}
              <div className="detail-section">
                <h3>🌾 Product Information</h3>
                <div className="detail-grid">
                  <img src={`/uploads/${selectedOrder.imagePath}`} alt={selectedOrder.cropName} className="detail-image" />
                  <div className="detail-info">
                    <p><b>Crop:</b> {selectedOrder.cropName}</p>
                    <p><b>Quantity:</b> {selectedOrder.quantity} kg</p>
                    <p><b>Price:</b> ₹{selectedOrder.price}</p>
                    <p><b>Quality:</b> {selectedOrder.qualityGrade}</p>
                    <p><b>Harvest Date:</b> {selectedOrder.harvestDate}</p>
                  </div>
                </div>
              </div>

              {/* Farmer Info */}
              <div className="detail-section">
                <h3>👨‍🌾 Farmer (Pickup)</h3>
                <div className="contact-card">
                  <p><b>Username:</b> {selectedOrder.farmerUsername}</p>
                  <p><b>Farm:</b> {selectedOrder.farmName}</p>
                  <p><b>Location:</b> {selectedOrder.farmLocation}</p>
                  <p><b>Phone:</b> {selectedOrder.farmerMobile}</p>
                  <p><b>Coordinates:</b> {selectedOrder.farmerLatitude}, {selectedOrder.farmerLongitude}</p>
                </div>
              </div>

              {/* Retailer Info */}
              <div className="detail-section">
                <h3>🏪 Retailer (Delivery)</h3>
                <div className="contact-card">
                  <p><b>Username:</b> {selectedOrder.retailerUsername}</p>
                  <p><b>Shop:</b> {selectedOrder.retailerShopName}</p>
                  <p><b>Address:</b> {selectedOrder.deliveryAddress}</p>
                  <p><b>Phone:</b> {selectedOrder.deliveryPhone}</p>
                  <p><b>Coordinates:</b> {selectedOrder.retailerLatitude}, {selectedOrder.retailerLongitude}</p>
                </div>
              </div>

              {/* Ownership History */}
              <div className="detail-section">
                <h3>📜 Ownership History</h3>
                <div className="history-list">
                  {selectedOrder.ownershipHistory?.map(oh => (
                    <div key={oh.id} className="history-item">
                      <span className="history-icon">
                        {oh.ownerRole === "FARMER" ? "🌱" : oh.ownerRole === "DISTRIBUTOR" ? "🚚" : "🏪"}
                      </span>
                      <div className="history-info">
                        <span className="role-badge">{oh.ownerRole}</span>
                        <span className="owner-name">{oh.username}</span>
                        <span className="history-time">{oh.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipment History */}
              <div className="detail-section">
                <h3>🚚 Shipment History</h3>
                {selectedOrder.shipmentHistory?.length > 0 ? (
                  <div className="shipment-list">
                    {selectedOrder.shipmentHistory.map(sh => (
                      <div key={sh.id} className="shipment-item">
                        <div className="shipment-marker"></div>
                        <div className="shipment-content">
                          <strong>{sh.location}</strong>
                          <span className={`status-mini ${getStatusClass(sh.status)}`}>{sh.status}</span>
                          {sh.conditionData && <span className="condition">📊 {sh.conditionData}</span>}
                          <span className="shipment-time">{sh.timestamp?.substring(0, 16).replace("T", " ")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-data">No shipment logs yet.</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeOrderDetails}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Shipment Modal */}
      {showShipmentModal && selectedOrder && (
        <div className="overlay">
          <div className="shipment-modal">
            <button className="modal-close" onClick={closeShipmentModal}>×</button>

            <div className="modal-header">
              <h2>🚚 Add Shipment Update</h2>
              <span className="order-ref">Order #{selectedOrder.orderId}</span>
            </div>

            <div className="modal-body">
              <div className="shipment-summary">
                <img src={`/uploads/${selectedOrder.imagePath}`} alt={selectedOrder.cropName} />
                <div>
                  <h4>{selectedOrder.cropName}</h4>
                  <p>To: {selectedOrder.retailerUsername} • {selectedOrder.retailerShopName}</p>
                </div>
              </div>

              <form onSubmit={handleShipmentSubmit} className="shipment-form">
                <div className="form-group">
                  <label>📍 Current Location *</label>
                  <input
                    type="text"
                    value={shipmentForm.location}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, location: e.target.value })}
                    placeholder="e.g., Highway 45, Near City Mall"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Latitude</label>
                    <input
                      type="text"
                      value={shipmentForm.latitude}
                      onChange={(e) => setShipmentForm({ ...shipmentForm, latitude: e.target.value })}
                      placeholder="e.g., 17.3850"
                    />
                  </div>
                  <div className="form-group">
                    <label>Longitude</label>
                    <input
                      type="text"
                      value={shipmentForm.longitude}
                      onChange={(e) => setShipmentForm({ ...shipmentForm, longitude: e.target.value })}
                      placeholder="e.g., 78.4867"
                    />
                  </div>
                  <button type="button" className="btn btn-location" onClick={getCurrentLocation}>
                    📌 Get Current
                  </button>
                </div>

                <div className="form-group">
                  <label>📊 Condition Data (Optional)</label>
                  <input
                    type="text"
                    value={shipmentForm.conditionData}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, conditionData: e.target.value })}
                    placeholder="e.g., Temp: 28°C, Humidity: 65%"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={shipmentForm.status}
                    onChange={(e) => setShipmentForm({ ...shipmentForm, status: e.target.value })}
                  >
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={closeShipmentModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? "Adding..." : "✅ Add Update"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  ) : (
    <DashboardLayout role="distributor" display={false}>
      <h2>Blocked</h2>
      <p>You are blocked by admin</p>
    </DashboardLayout>
  );
}
