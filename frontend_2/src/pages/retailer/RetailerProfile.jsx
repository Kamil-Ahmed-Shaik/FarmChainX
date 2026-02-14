import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import "../../styles/Components.css";

export default function RetailerProfile() {
  const userId = localStorage.getItem("userId");
  const status = localStorage.getItem("status");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    axios.get(`/retailer/${userId}/profile`)
      .then((res) => { setData(res.data); setLoading(false); })
      .catch((err) => { console.error("Profile fetch error:", err); setLoading(false); });
  }, [userId]);

  const handleChange = (field, value) => { setData({ ...data, [field]: value }); };

  const locateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setData({
          ...data,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        });
        setLocating(false);
      },
      (error) => {
        alert("Unable to get location: " + error.message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const updateProfile = async () => {
    try {
      await axios.post(`/retailer/${userId}/profile`, data);
      alert("Profile updated successfully!");
    } catch (err) { console.error("Update failed:", err); alert("Update failed"); }
  };

  if (loading) return (<DashboardLayout role="retailer"><p>Loading...</p></DashboardLayout>);
  if (status === "true") return (<DashboardLayout role="retailer" display={false}><h2>Access Restricted</h2><p>You are blocked by admin</p></DashboardLayout>);

  return (
    <DashboardLayout role="retailer" display={true}>
      <header className="dashboard-header">
        <h2 className="dashboard-title">Retailer Profile</h2>
      </header>

      <div className="form-container">
        <div className="form-row">
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Account Info</h3>
            <div className="form-group"><label>Username</label><input value={data.username || ""} readOnly /></div>
            <div className="form-group"><label>Role</label><input value={data.role || ""} readOnly /></div>
            <div className="form-group"><label>Blocked</label><input value={String(data.block)} readOnly /></div>
          </div>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Shop Details</h3>
            <div className="form-group"><label>Shop Name</label><input value={data.shopName || ""} onChange={(e) => handleChange("shopName", e.target.value)} /></div>
            <div className="form-group"><label>Location</label><input value={data.location || ""} onChange={(e) => handleChange("location", e.target.value)} /></div>
          </div>
        </div>

        <div className="form-row" style={{ marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem' }}>GPS Location</h3>
            <div className="form-group">
              <label>Latitude</label>
              <input value={data.latitude || ""} onChange={(e) => handleChange("latitude", e.target.value)} placeholder="Click 'Locate Me'" />
            </div>
            <div className="form-group">
              <label>Longitude</label>
              <input value={data.longitude || ""} onChange={(e) => handleChange("longitude", e.target.value)} placeholder="Click 'Locate Me'" />
            </div>
            <button type="button" className="btn btn-secondary" onClick={locateMe} disabled={locating} style={{ marginTop: '0.5rem' }}>
              {locating ? "📍 Locating..." : "📍 Locate Me"}
            </button>
          </div>
          <div>
            {data.latitude && data.longitude && (
              <>
                <h3 style={{ marginBottom: '0.5rem' }}>Shop Location</h3>
                <div className="map-container">
                  <iframe title="map" src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=15&output=embed`} />
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={updateProfile}>Update Profile</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
