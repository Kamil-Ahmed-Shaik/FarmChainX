import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import { QRCodeCanvas } from "qrcode.react";
import "../../styles/Components.css";
import "../../styles/AdminTransactions.css";

export default function AdminTransactions() {
    const token = localStorage.getItem("token");
    const [transactions, setTransactions] = useState([]);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchTransactions = useCallback(async () => {
        try {
            const res = await axios.get("/admin/transactions", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(res.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const openVerification = async (orderId) => {
        try {
            const res = await axios.get(`/admin/transactions/${orderId}/verify`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedTransaction(res.data);
        } catch (error) {
            console.error("Error fetching transaction details:", error);
        }
    };

    const downloadLogs = () => {
        const logData = {
            transaction: selectedTransaction,
            exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(logData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `transaction_${selectedTransaction.orderId}_logs.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "ACCEPTED": return "status-accepted";
            case "REJECTED": return "status-rejected";
            case "IN_TRANSIT": return "status-transit";
            case "DELIVERED": return "status-delivered";
            case "SOLD_OUT": return "status-soldout";
            default: return "status-pending";
        }
    };

    const filteredTransactions = transactions.filter(t =>
        t.cropName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.sellerUsername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.buyerUsername?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const generateQRData = () => {
        if (!selectedTransaction) return "";
        return JSON.stringify({
            orderId: selectedTransaction.orderId,
            cropName: selectedTransaction.cropName,
            seller: selectedTransaction.sellerUsername,
            buyer: selectedTransaction.buyerUsername,
            status: selectedTransaction.orderStatus,
            blockchainHash: selectedTransaction.blockchainHash,
            ownershipHistory: selectedTransaction.ownershipHistory?.map(o => ({
                owner: o.username,
                role: o.ownerRole,
                time: o.timestamp
            }))
        });
    };

    return (
        <DashboardLayout role="admin" display={true}>
            <header className="dashboard-header">
                <h2 className="dashboard-title">🔗 Transaction Verification</h2>
                <p className="dashboard-subtitle">Verify and track all crop purchases in the supply chain</p>
            </header>

            <div className="transactions-container">
                <div className="search-filter-bar">
                    <input
                        type="text"
                        placeholder="🔍 Search by crop, seller, or buyer..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <div className="stats-badges">
                        <span className="stat-badge total">{transactions.length} Total</span>
                        <span className="stat-badge delivered">{transactions.filter(t => t.orderStatus === "DELIVERED").length} Delivered</span>
                        <span className="stat-badge transit">{transactions.filter(t => t.orderStatus === "IN_TRANSIT").length} In Transit</span>
                    </div>
                </div>

                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Loading transactions...</p>
                    </div>
                ) : (
                    <div className="transactions-table-wrapper">
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Crop</th>
                                    <th>Farmer (Seller)</th>
                                    <th>Buyer</th>
                                    <th>Distributor</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.map(t => (
                                    <tr key={t.orderId}>
                                        <td><span className="order-id">#{t.orderId}</span></td>
                                        <td>
                                            <div className="crop-cell">
                                                <img src={`/uploads/${t.imagePath}`} alt={t.cropName} className="crop-thumb" />
                                                <span>{t.cropName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-cell">
                                                <span className="user-icon">👨‍🌾</span>
                                                <span>{t.sellerUsername}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-cell">
                                                <span className="user-icon">{t.buyerRole === "RETAILER" ? "🏪" : "🚚"}</span>
                                                <span>{t.buyerUsername}</span>
                                            </div>
                                        </td>
                                        <td>{t.distributorName || "-"}</td>
                                        <td><span className={`status-badge ${getStatusClass(t.orderStatus)}`}>{t.orderStatus}</span></td>
                                        <td>{t.createdAt?.substring(0, 10)}</td>
                                        <td>
                                            <button className="btn btn-verify" onClick={() => openVerification(t.orderId)}>
                                                🔍 Verify
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Verification Overlay */}
            {selectedTransaction && (
                <div className="overlay">
                    <div className="overlay-box verification-overlay">
                        <button className="overlay-close" onClick={() => setSelectedTransaction(null)}>×</button>

                        <div className="verification-header">
                            <h2>🔗 Transaction Verification</h2>
                            <span className={`status-badge large ${getStatusClass(selectedTransaction.orderStatus)}`}>
                                {selectedTransaction.orderStatus}
                            </span>
                        </div>

                        <div className="verification-content">
                            {/* Two-Pane Layout: Seller & Buyer */}
                            <div className="verification-panes">
                                {/* Left Pane - Seller (Farmer) */}
                                <div className="verification-pane seller-pane">
                                    <h3>👨‍🌾 Seller (Farmer) Details</h3>
                                    <div className="pane-content">
                                        <div className="detail-row">
                                            <span className="label">Username:</span>
                                            <span className="value">{selectedTransaction.sellerUsername}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Farm Name:</span>
                                            <span className="value">{selectedTransaction.farmName}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Mobile:</span>
                                            <span className="value">{selectedTransaction.farmerMobile}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Location:</span>
                                            <span className="value">{selectedTransaction.farmLocation}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Coordinates:</span>
                                            <span className="value">{selectedTransaction.farmerLatitude}, {selectedTransaction.farmerLongitude}</span>
                                        </div>
                                        <div className="mini-map">
                                            <iframe
                                                title="Farmer Location"
                                                src={`https://maps.google.com/maps?q=${selectedTransaction.farmerLatitude},${selectedTransaction.farmerLongitude}&z=14&output=embed`}
                                            ></iframe>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Pane - Buyer */}
                                <div className="verification-pane buyer-pane">
                                    <h3>{selectedTransaction.buyerRole === "RETAILER" ? "🏪" : "🚚"} Buyer Details</h3>
                                    <div className="pane-content">
                                        <div className="detail-row">
                                            <span className="label">Role:</span>
                                            <span className="value">{selectedTransaction.buyerRole}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Username:</span>
                                            <span className="value">{selectedTransaction.buyerUsername}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">{selectedTransaction.buyerRole === "RETAILER" ? "Shop Name:" : "Company:"}</span>
                                            <span className="value">{selectedTransaction.buyerShopName || selectedTransaction.buyerCompanyName}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Location:</span>
                                            <span className="value">{selectedTransaction.buyerLocation}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">Coordinates:</span>
                                            <span className="value">{selectedTransaction.buyerLatitude}, {selectedTransaction.buyerLongitude}</span>
                                        </div>
                                        <div className="mini-map">
                                            <iframe
                                                title="Buyer Location"
                                                src={`https://maps.google.com/maps?q=${selectedTransaction.buyerLatitude},${selectedTransaction.buyerLongitude}&z=14&output=embed`}
                                            ></iframe>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Crop Details */}
                            <div className="crop-details-section">
                                <h3>🌾 Crop Details</h3>
                                <div className="crop-details-grid">
                                    <div className="crop-image-large">
                                        <img src={`/uploads/${selectedTransaction.imagePath}`} alt={selectedTransaction.cropName} />
                                    </div>
                                    <div className="crop-info">
                                        <p><b>Crop Name:</b> {selectedTransaction.cropName}</p>
                                        <p><b>Quantity:</b> {selectedTransaction.quantity} kg</p>
                                        <p><b>Price:</b> ₹{selectedTransaction.price}</p>
                                        <p><b>Quality Grade:</b> {selectedTransaction.qualityGrade}</p>
                                        <p><b>Harvest Date:</b> {selectedTransaction.harvestDate}</p>
                                        <p><b>Blockchain Hash:</b> <code>{selectedTransaction.blockchainHash?.substring(0, 20)}...</code></p>
                                    </div>
                                </div>
                            </div>

                            {/* Ownership History Timeline */}
                            <div className="history-section">
                                <h3>📜 Ownership History</h3>
                                <div className="timeline">
                                    {selectedTransaction.ownershipHistory?.map((oh, idx) => (
                                        <div key={oh.id} className={`timeline-item ${idx === selectedTransaction.ownershipHistory.length - 1 ? 'current' : ''}`}>
                                            <div className="timeline-marker">
                                                {oh.ownerRole === "FARMER" ? "🌱" : oh.ownerRole === "DISTRIBUTOR" ? "🚚" : "🏪"}
                                            </div>
                                            <div className="timeline-content">
                                                <div className="timeline-header">
                                                    <span className="owner-role">{oh.ownerRole}</span>
                                                    <span className="owner-name">{oh.username}</span>
                                                </div>
                                                <div className="timeline-time">{oh.timestamp}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipment Details */}
                            <div className="shipment-section">
                                <h3>🚚 Shipment Details</h3>
                                {selectedTransaction.shipmentHistory?.length > 0 ? (
                                    <table className="shipment-table">
                                        <thead>
                                            <tr>
                                                <th>Location</th>
                                                <th>Status</th>
                                                <th>Condition</th>
                                                <th>Coordinates</th>
                                                <th>Timestamp</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedTransaction.shipmentHistory.map(sh => (
                                                <tr key={sh.id}>
                                                    <td>{sh.location}</td>
                                                    <td><span className={`status-badge ${getStatusClass(sh.status)}`}>{sh.status}</span></td>
                                                    <td>{sh.conditionData || "-"}</td>
                                                    <td>{sh.latitude}, {sh.longitude}</td>
                                                    <td>{sh.timestamp?.substring(0, 16).replace("T", " ")}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="no-data">No shipment logs available yet.</p>
                                )}
                            </div>

                            {/* QR Code */}
                            <div className="qr-section">
                                <h3>📱 Transaction QR Code</h3>
                                <div className="qr-container">
                                    <QRCodeCanvas value={generateQRData()} size={180} level="H" />
                                    <p className="qr-hint">Scan to verify transaction authenticity</p>
                                </div>
                            </div>
                        </div>

                        <div className="verification-footer">
                            <button className="btn btn-secondary" onClick={() => setSelectedTransaction(null)}>Close</button>
                            <button className="btn btn-primary" onClick={downloadLogs}>📥 Download Logs</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}