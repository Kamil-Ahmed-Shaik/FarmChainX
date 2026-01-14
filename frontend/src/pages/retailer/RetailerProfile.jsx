import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";

export default function RetailerProfile() {
  const userId = localStorage.getItem("userId");
  const status = localStorage.getItem("status"); // "true" or "false"

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch retailer profile
  useEffect(() => {
    axios
      .get(`/retailer/${userId}/profile`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        setLoading(false);
      });
  }, [userId]);

  // Handle input change
  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  // Update profile
  const updateProfile = async () => {
    try {
      await axios.post(`/retailer/${userId}/profile`, data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout role="retailer">
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  // Blocked retailer
  if (status === "true") {
    return (
      <DashboardLayout role="retailer" display={false}>
        <h2>Access Restricted</h2>
        <p>You are blocked by admin</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="retailer" display={true}>
      <h2>Retailer Profile</h2>

      {/* Read-only fields */}
      <label>Username</label>
      <input value={data.username || ""} readOnly />

      <label>Role</label>
      <input value={data.role || ""} readOnly />

      <label>Blocked</label>
      <input value={String(data.block)} readOnly />

      {/* Editable fields */}
      <label>Shop Name</label>
      <input
        value={data.shopName || ""}
        onChange={(e) => handleChange("shopName", e.target.value)}
      />

      <label>Location</label>
      <input
        value={data.location || ""}
        onChange={(e) => handleChange("location", e.target.value)}
      />

      <br /><br />
      <button onClick={updateProfile}>Update Profile</button>
    </DashboardLayout>
  );
}
