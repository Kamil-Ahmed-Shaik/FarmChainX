import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import { QRCodeCanvas } from "qrcode.react";
import "../../styles/Components.css";

export default function DistributorCrops() {
  const distributorId = localStorage.getItem("userId");
  const status = localStorage.getItem("status");

  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [trace, setTrace] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCrops = crops.filter(c =>
    c.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (distributorId) {
      axios.get(`/distributor/market/${distributorId}`).then(res => setCrops(res.data));
    }
  }, [distributorId]);

  const openCrop = async (crop) => {
    setSelectedCrop(crop);
    const traceRes = await axios.get(`/trace/${crop.id}`);
    setTrace(traceRes.data);
  };

  const buyCrop = async () => {
    await axios.post(`/distributor/buy/${selectedCrop.id}/${distributorId}/${selectedCrop.farmerId}`);
    alert("Order placed successfully!");
    setSelectedCrop(null);
    window.location.reload();
  };

  const downloadLogs = () => {
    const blob = new Blob([JSON.stringify(trace, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `crop_${selectedCrop.id}_trace_logs.json`; a.click();
  };

  return status === "false" ? (
    <DashboardLayout role="distributor" display={true}>
      <header className="dashboard-header flex justify-between items-center">
        <h2 className="dashboard-title">Crop Marketplace</h2>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search marketplace..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </header>

      <div className="product-grid">
        {filteredCrops.map(c => (
          <div key={c.id} className="product-card" onClick={() => openCrop(c)}>
            <img src={`/uploads/${c.imagePath}`} alt={c.cropName} />
            <div className="product-card-body">
              <h4>{c.cropName}</h4>
              <p>Farmer: {c.username}</p>
              <p>Qty: {c.quantity} kg | ₹{c.price}</p>
              <p><span className={`status-badge ${c.crop_status === 'VERIFIED' ? 'status-valid' : 'status-pending'}`}>{c.crop_status}</span></p>
            </div>
          </div>
        ))}
      </div>

      {selectedCrop && (
        <div className="overlay">
          <div className="overlay-box">
            <button className="overlay-close" onClick={() => setSelectedCrop(null)}>X</button>
            <div className="overlay-content">
              <div className="overlay-section">
                <h3>Crop & Farmer Details</h3>
                <p><b>Crop Name:</b> {selectedCrop.cropName}</p>
                <p><b>Harvest Date:</b> {selectedCrop.harvestDate}</p>
                <p><b>Quality:</b> {selectedCrop.qualityGrade}</p>
                <p><b>Blockchain Hash:</b> <code style={{ fontSize: '0.7rem' }}>{selectedCrop.blockchainHash}</code></p>
                <p><b>Farmer:</b> {selectedCrop.username}</p>
                <p><b>Location:</b> {selectedCrop.location}</p>

                <h4 style={{ marginTop: '1rem' }}>Trace History</h4>
                {trace.length > 0 ? (
                  <table className="dashboard-table">
                    <thead><tr><th>Role</th><th>User</th><th>Time</th></tr></thead>
                    <tbody>{trace.map(t => (<tr key={t.id}><td>{t.ownerRole}</td><td>{t.username}</td><td>{t.timestamp}</td></tr>))}</tbody>
                  </table>
                ) : <p>No trace logs.</p>}
              </div>
              <div className="overlay-section">
                <h3>Farm Location</h3>
                <div className="map-container">
                  <iframe title="map" src={`https://maps.google.com/maps?q=${selectedCrop.latitude},${selectedCrop.longitude}&z=15&output=embed`}></iframe>
                </div>
                <p><b>Lat:</b> {selectedCrop.latitude} | <b>Lng:</b> {selectedCrop.longitude}</p>
                <h4 style={{ marginTop: '1rem' }}>Trace QR</h4>
                <QRCodeCanvas value={JSON.stringify(trace)} size={120} />
                <button className="btn btn-secondary" style={{ marginTop: '0.5rem' }} onClick={downloadLogs}>Download Logs</button>
              </div>
            </div>
            <div className="overlay-footer">
              <button className="btn btn-danger" onClick={() => setSelectedCrop(null)}>Close</button>
              <button className="btn btn-success" onClick={buyCrop}>Buy Crop</button>
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
