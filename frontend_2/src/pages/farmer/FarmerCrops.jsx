import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import "../../styles/Components.css";

export default function FarmerCrops() {
  const farmerId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("mycrops");
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [editCrop, setEditCrop] = useState({});
  const [traceLogs, setTraceLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCrops = crops.filter(c =>
    c.cropName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [newCrop, setNewCrop] = useState({
    cropName: "", quantity: "", harvestDate: "", qualityGrade: "",
    latitude: "", longitude: "", imagePath: "", price: ""
  });

  const fetchCrops = useCallback(async () => {
    const res = await axios.get(`/farmer/crops/${farmerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setCrops(res.data);
  }, [farmerId, token]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchCrops(); }, [fetchCrops]);

  const openCrop = async (crop) => {
    setSelectedCrop(crop);
    setEditCrop({ ...crop });
    const traceRes = await axios.get(`/trace/${crop.id}`);
    setTraceLogs(traceRes.data);
  };

  const closeOverlay = () => { setSelectedCrop(null); setTraceLogs([]); };

  const locateMe = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setNewCrop({ ...newCrop, latitude: pos.coords.latitude, longitude: pos.coords.longitude });
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setNewCrop({ ...newCrop, imagePath: file.name });
  };

  const submitCrop = async (e) => {
    e.preventDefault();
    await axios.post(`/farmer/crops/${farmerId}`, newCrop, { headers: { Authorization: `Bearer ${token}` } });
    alert("Crop added successfully!");
    setNewCrop({ cropName: "", quantity: "", harvestDate: "", qualityGrade: "", latitude: "", longitude: "", imagePath: "", price: "" });
    setActiveTab("mycrops");
    fetchCrops();
  };

  const updateCrop = async () => {
    await axios.post("/farmer/crops/update", editCrop, { headers: { Authorization: `Bearer ${token}` } });
    alert("Crop updated successfully");
    fetchCrops();
    closeOverlay();
  };

  const deleteCrop = async () => {
    if (!window.confirm("Are you sure to delete this crop?")) return;
    await axios.delete(`/farmer/crops/delete/${editCrop.id}`, { headers: { Authorization: `Bearer ${token}` } });
    alert("Crop deleted successfully");
    fetchCrops();
    closeOverlay();
  };

  const downloadLogs = () => {
    let csv = "ID,Owner Role,Owner ID,Username,Timestamp\n";
    traceLogs.forEach(t => { csv += `${t.id},${t.ownerRole},${t.ownerId},${t.username},${t.timestamp}\n`; });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `crop_${selectedCrop.id}_trace_logs.csv`; a.click();
  };

  return (
    <DashboardLayout role="farmer" display={true}>
      <header className="dashboard-header flex justify-between items-center">
        <h2 className="dashboard-title">My Crops</h2>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search crops..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
      </header>

      <div className="tabs">
        <button className={activeTab === "mycrops" ? "active" : ""} onClick={() => setActiveTab("mycrops")}>My Crops</button>
        <button className={activeTab === "newcrop" ? "active" : ""} onClick={() => setActiveTab("newcrop")}>+ Add Crop</button>
      </div>

      {activeTab === "mycrops" && (
        <div className="product-grid">
          {filteredCrops.map(c => (
            <div key={c.id} className="product-card" onClick={() => openCrop(c)}>
              <img src={`/uploads/${c.imagePath}`} alt="crop" />
              <div className="product-card-body">
                <h4>{c.cropName}</h4>
                <p>Harvest: {c.harvestDate}</p>
                <p><span className={`status-badge ${c.status === 'VERIFIED' ? 'status-valid' : 'status-pending'}`}>{c.status}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "newcrop" && (
        <div className="form-container">
          <form onSubmit={submitCrop}>
            <div className="form-row">
              <div>
                <h3 style={{ marginBottom: '1rem' }}>Crop Details</h3>
                <div className="form-group">
                  <label>Crop Name</label>
                  <input value={newCrop.cropName} onChange={e => setNewCrop({ ...newCrop, cropName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Quantity (kg)</label>
                  <input type="number" value={newCrop.quantity} onChange={e => setNewCrop({ ...newCrop, quantity: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input type="number" value={newCrop.price} onChange={e => setNewCrop({ ...newCrop, price: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Harvest Date</label>
                  <input type="date" value={newCrop.harvestDate} onChange={e => setNewCrop({ ...newCrop, harvestDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Quality Grade</label>
                  <select value={newCrop.qualityGrade} onChange={e => setNewCrop({ ...newCrop, qualityGrade: e.target.value })} required>
                    <option value="">Select Quality</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Image</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} required />
                </div>
                <button type="submit" className="btn btn-primary">Add Crop</button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem' }}>Farm Location</h3>
                <div className="map-container">
                  <iframe title="map"
                    src={newCrop.latitude && newCrop.longitude
                      ? `https://maps.google.com/maps?q=${newCrop.latitude},${newCrop.longitude}&z=15&output=embed`
                      : `https://maps.google.com/maps?q=India&z=4&output=embed`}
                  />
                </div>
                <p><b>Latitude:</b> {newCrop.latitude}</p>
                <p><b>Longitude:</b> {newCrop.longitude}</p>
                <button type="button" className="btn btn-secondary" onClick={locateMe}>📍 Locate Me</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {selectedCrop && (
        <div className="overlay">
          <div className="overlay-box">
            <button className="overlay-close" onClick={closeOverlay}>X</button>
            <div className="overlay-content">
              <div className="overlay-section">
                <h3>Crop Details</h3>
                <div className="form-group"><label>Crop Name</label><input disabled={editCrop.status === "VERIFIED"} value={editCrop.cropName} onChange={e => setEditCrop({ ...editCrop, cropName: e.target.value })} /></div>
                <div className="form-group"><label>Quantity</label><input disabled={editCrop.status === "VERIFIED"} value={editCrop.quantity} onChange={e => setEditCrop({ ...editCrop, quantity: e.target.value })} /></div>
                <div className="form-group"><label>Price</label><input disabled={editCrop.status === "VERIFIED"} value={editCrop.price} onChange={e => setEditCrop({ ...editCrop, price: e.target.value })} /></div>
                <div className="form-group"><label>Quality</label><input disabled={editCrop.status === "VERIFIED"} value={editCrop.qualityGrade} onChange={e => setEditCrop({ ...editCrop, qualityGrade: e.target.value })} /></div>
                <p><b>Status:</b> <span className={`status-badge ${editCrop.status === 'VERIFIED' ? 'status-valid' : 'status-pending'}`}>{editCrop.status}</span></p>
                <h4 style={{ marginTop: '1rem' }}>Trace QR</h4>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://localhost:8080/farmer/trace/download/${selectedCrop.id}`} alt="QR" style={{ marginBottom: '1rem' }} />
                <button className="btn btn-secondary" onClick={downloadLogs}>Download Logs</button>
              </div>
              <div className="overlay-section">
                <h3>Location</h3>
                <div className="map-container">
                  <iframe title="map" src={`https://maps.google.com/maps?q=${editCrop.latitude},${editCrop.longitude}&z=15&output=embed`} />
                </div>
                <p><b>Latitude:</b> {editCrop.latitude}</p>
                <p><b>Longitude:</b> {editCrop.longitude}</p>
              </div>
            </div>
            {editCrop.status === "PENDING" && (
              <div className="overlay-footer">
                <button className="btn btn-primary" onClick={updateCrop}>Update</button>
                <button className="btn btn-danger" onClick={deleteCrop}>Delete</button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
