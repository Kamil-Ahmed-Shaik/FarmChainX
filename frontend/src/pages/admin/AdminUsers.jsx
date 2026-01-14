import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import "../../styles/dashboard.css";

export default function AdminUsers() {
  const status = localStorage.getItem("status"); 
  const [users, setUsers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const loadUsers = () => {
    axios.get("/admin/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const blockUser = async (id) => {
    await axios.post(`/admin/users/${id}/block`);
    alert("User blocked");
    loadUsers();
  };

  const unblockUser = async (id) => {
    await axios.post(`/admin/users/${id}/unblock`);
    alert("User unblocked");
    loadUsers();
  };

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
      <h2>All Users</h2>

      {users.map((u) => (
        <div key={u.userId} className="inboard-card">

          {/* HEADER */}
          <div className="inboard-header">
            <div>
              <b>{u.userName}</b>
              <div className="small-text">
                ID: {u.userId} | Role: {u.role} | Blocked: {String(u.blocked)}
              </div>
            </div>

            <div className="actions">
              <button
                className={`accept ${u.blocked ? "disabled" : ""}`}
                onClick={() => blockUser(u.userId)}
                disabled={u.blocked}
              >
                BLOCK
              </button>

              <button
                className={`reject ${!u.blocked ? "disabled" : ""}`}
                onClick={() => unblockUser(u.userId)}
                disabled={!u.blocked}
              >
                UNBLOCK
              </button>

              {/* V ICON AT CORNER */}
              <span
                className="toggle corner-toggle"
                onClick={() => toggleExpand(u.userId)}
              >
                {expandedId === u.userId ? "▲" : "▼"}
              </span>
            </div>
          </div>

          {/* DETAILS */}
          {expandedId === u.userId && (
            <div className="inboard-details">

              <p><b>Username:</b> {u.userName}</p>
              <p><b>Role:</b> {u.role}</p>
              <p><b>Blocked:</b> {String(u.blocked)}</p>

              {u.role === "FARMER" && (
                <>
                  <p><b>Farm Name:</b> {u.farmName}</p>
                  <p><b>Crop Type:</b> {u.cropType}</p>
                  <p><b>Location:</b> {u.location1}</p>
                  <p><b>Farm Location:</b> {u.farmLocation}</p>
                  <p><b>Status:</b> {u.status}</p>
                  <p><b>Mobile:</b> {u.mobile}</p>
                  <p><b>Acres:</b> {u.acres}</p>
                  <p><b>Expected Yield:</b> {u.expectedYield}</p>
                  <p><b>Soil Type:</b> {u.soil_type}</p>
                  <p><b>Aadhar:</b> {u.aadhar}</p>
                </>
              )}

              {u.role === "DISTRIBUTOR" && (
                <>
                  <p><b>Company:</b> {u.companyName}</p>
                  <p><b>Region:</b> {u.region}</p>
                </>
              )}

              {u.role === "RETAILER" && (
                <>
                  <p><b>Shop Name:</b> {u.shopName}</p>
                  <p><b>Location:</b> {u.location}</p>
                </>
              )}
            </div>
          )}

        </div>
      ))}
    </DashboardLayout>
  );
}
