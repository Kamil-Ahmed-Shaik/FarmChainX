import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import "../../styles/dashboard.css";

export default function AdminInbordings() {
  const status = localStorage.getItem("status"); // "true" or "false"
  const [farmers, setFarmers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails] = useState(null);

  // Fetch pending farmers
  const loadFarmers = () => {
    axios.get("/admin/inbording")
      .then(res => setFarmers(res.data))
      .catch(err => console.error("Fetch error:", err));
  };

  useEffect(() => {
    loadFarmers();
  }, []);

  // Expand farmer
  const toggleExpand = async (id) => {
    if (expandedId === id) {
      setExpandedId(null);
      setDetails(null);
      return;
    }

    try {
      const res = await axios.get(`/admin/inbording/${id}/verify`);
      setDetails(res.data);
      setExpandedId(id);
    } catch (err) {
      console.error("Verify error:", err);
    }
  };

  // Approve farmer
  const approveFarmer = async (id) => {
    await axios.post(`/admin/inbording/${id}/approve`);
    alert("Farmer approved");
    loadFarmers();
  };

  // Reject farmer
  const rejectFarmer = async (id) => {
    await axios.post(`/admin/inbording/${id}/reject`);
    alert("Farmer rejected");
    loadFarmers();
  };

  // Blocked admin
  if (status === "true") {
    return (
      <DashboardLayout role="admin" display={false}>
        <h2>Access Restricted</h2>
        <p>You are blocked by admin</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" display={true}>
      <h2>Farmer Inboarding</h2>

      {farmers.length === 0 && <p>No pending farmers</p>}

      {farmers.map((f) => (
        <div key={f.userId} className="inboard-card">
          
          {/* Top Bar */}
          <div className="inboard-header">
            <div>
              <b>Farmer</b>
              <div className="small-text">
                Farmer ID: {f.userId} | Block: {f.status}
              </div>
            </div>

            <div className="actions">
              <button className="accept" onClick={() => approveFarmer(f.userId)}>ACCEPT</button>
              <button className="reject" onClick={() => rejectFarmer(f.userId)}>REJECT</button>
              <span className="toggle" onClick={() => toggleExpand(f.userId)}>
                {expandedId === f.userId ? "▲" : "▼"}
              </span>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedId === f.userId && details && (
            <div className="inboard-details">
              <p><b>Username:</b> {details.username}</p>
              <p><b>Role:</b> {details.role}</p>
              <p><b>Farm Name:</b> {details.farmName}</p>
              <p><b>Crop Type:</b> {details.cropType}</p>
              <p><b>Location:</b> {details.location}</p>
              <p><b>Farm Location:</b> {details.farmLocation}</p>
              <p><b>Status:</b> {details.status}</p>
              <p><b>Mobile:</b> {details.mobile || "N/A"}</p>
              <p><b>Acres:</b> {details.acres || "N/A"}</p>
              <p><b>Expected Yield:</b> {details.expectedYield || "N/A"}</p>
              <p><b>Soil Type:</b> {details.soil_type || "N/A"}</p>
              <p><b>Aadhar:</b> {details.aadhar || "N/A"}</p>
            </div>
          )}
        </div>
      ))}
    </DashboardLayout>
  );
}
