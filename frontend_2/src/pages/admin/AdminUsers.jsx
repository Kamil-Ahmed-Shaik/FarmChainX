import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import "../../styles/Components.css";

export default function AdminUsers() {
  const status = localStorage.getItem("status");
  const [users, setUsers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const loadUsers = () => {
    axios.get("/admin/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { loadUsers(); }, []);

  const toggleExpand = (id) => { setExpandedId(expandedId === id ? null : id); };
  const blockUser = async (id) => { await axios.post(`/admin/users/${id}/block`); alert("User blocked"); loadUsers(); };
  const unblockUser = async (id) => { await axios.post(`/admin/users/${id}/unblock`); alert("User unblocked"); loadUsers(); };

  if (status === "true") {
    return (<DashboardLayout role="admin" display={false}><h2>Access Restricted</h2><p>You are blocked by admin</p></DashboardLayout>);
  }

  return (
    <DashboardLayout role="admin" display={true}>
      <header className="dashboard-header">
        <h2 className="dashboard-title">User Management</h2>
      </header>

      {users.length === 0 && <div className="dashboard-card"><p>No users found.</p></div>}

      {users.map((u) => (
        <div key={u.userId} className="inboard-card" style={{ borderLeftColor: u.role === 'FARMER' ? '#059669' : u.role === 'DISTRIBUTOR' ? '#3b82f6' : u.role === 'RETAILER' ? '#8b5cf6' : '#6b7280' }}>
          <div className="inboard-header">
            <div>
              <b style={{ fontSize: '1rem' }}>{u.userName}</b>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                <span style={{ background: '#e5e7eb', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', marginRight: '0.5rem' }}>{u.role}</span>
                ID: {u.userId}
                <span className={`status-badge ${u.blocked ? 'status-rejected' : 'status-valid'}`} style={{ marginLeft: '0.5rem' }}>{u.blocked ? 'Blocked' : 'Active'}</span>
              </div>
            </div>
            <div className="actions">
              <button className={`accept ${u.blocked ? "disabled" : ""}`} onClick={() => blockUser(u.userId)} disabled={u.blocked}>🚫 BLOCK</button>
              <button className={`reject ${!u.blocked ? "disabled" : ""}`} onClick={() => unblockUser(u.userId)} disabled={!u.blocked}>✅ UNBLOCK</button>
              <span className="corner-toggle" onClick={() => toggleExpand(u.userId)}>{expandedId === u.userId ? "▲" : "▼"}</span>
            </div>
          </div>

          {expandedId === u.userId && (
            <div className="inboard-details">
              {/* FARMER Details - Grid Layout */}
              {u.role === "FARMER" && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                  <div className="detail-card">
                    <h4 style={{ color: '#059669', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>🌾 Farm Info</h4>
                    <p><b>Farm Name:</b> {u.farmName || "N/A"}</p>
                    <p><b>Crop Type:</b> {u.cropType || "N/A"}</p>
                    <p><b>Acres:</b> {u.acres || "N/A"}</p>
                    <p><b>Soil Type:</b> {u.soil_type || "N/A"}</p>
                  </div>
                  <div className="detail-card">
                    <h4 style={{ color: '#3b82f6', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>📍 Location</h4>
                    <p><b>Location:</b> {u.location1 || "N/A"}</p>
                    <p><b>Farm Location:</b> {u.farmLocation || "N/A"}</p>
                    <p><b>Expected Yield:</b> {u.expectedYield || "N/A"}</p>
                  </div>
                  <div className="detail-card">
                    <h4 style={{ color: '#8b5cf6', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>📱 Contact & ID</h4>
                    <p><b>Mobile:</b> {u.mobile || "N/A"}</p>
                    <p><b>Aadhar:</b> {u.aadhar || "N/A"}</p>
                    <p><b>Status:</b> <span className={`status-badge ${u.status === 'APPROVED' ? 'status-valid' : 'status-pending'}`}>{u.status}</span></p>
                  </div>
                </div>
              )}

              {/* DISTRIBUTOR Details */}
              {u.role === "DISTRIBUTOR" && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="detail-card">
                    <h4 style={{ color: '#3b82f6', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>🏢 Company</h4>
                    <p><b>Company Name:</b> {u.companyName || "N/A"}</p>
                    <p><b>Region:</b> {u.region || "N/A"}</p>
                  </div>
                  <div className="detail-card">
                    <h4 style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>📊 Status</h4>
                    <p><b>User ID:</b> {u.userId}</p>
                    <p><b>Blocked:</b> {String(u.blocked)}</p>
                  </div>
                </div>
              )}

              {/* RETAILER Details */}
              {u.role === "RETAILER" && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="detail-card">
                    <h4 style={{ color: '#8b5cf6', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>🏪 Shop</h4>
                    <p><b>Shop Name:</b> {u.shopName || "N/A"}</p>
                    <p><b>Location:</b> {u.location || "N/A"}</p>
                  </div>
                  <div className="detail-card">
                    <h4 style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>📊 Status</h4>
                    <p><b>User ID:</b> {u.userId}</p>
                    <p><b>Blocked:</b> {String(u.blocked)}</p>
                  </div>
                </div>
              )}

              {/* ADMIN Details */}
              {u.role === "ADMIN" && (
                <div className="detail-card">
                  <h4 style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>👤 Admin Info</h4>
                  <p><b>Username:</b> {u.userName}</p>
                  <p><b>User ID:</b> {u.userId}</p>
                  <p><b>Blocked:</b> {String(u.blocked)}</p>
                </div>
              )}

              {/* CONSUMER Details */}
              {u.role === "CONSUMER" && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="detail-card">
                    <h4 style={{ color: '#8b5cf6', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>👤 Personal Info</h4>
                    <p><b>Full Name:</b> {u.fullName || "N/A"}</p>
                    <p><b>Mobile:</b> {u.mobile || "N/A"}</p>
                  </div>
                  <div className="detail-card">
                    <h4 style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>📍 Address</h4>
                    <p><b>Address:</b> {u.address || "N/A"}</p>
                    <p><b>City:</b> {u.city || "N/A"}</p>
                    <p><b>State:</b> {u.state || "N/A"}</p>
                    <p><b>Pincode:</b> {u.pincode || "N/A"}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </DashboardLayout>
  );
}
