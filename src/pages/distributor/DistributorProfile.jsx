import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";

export default function DistributorProfile() {
  const userId = localStorage.getItem("userId");
  const status = localStorage.getItem("status"); // "true" or "false"

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch distributor profile
  useEffect(() => {
    axios
      .get(`/distributor/${userId}/profile`)
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
      await axios.post(`/distributor/${userId}/profile`, data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout role="distributor">
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  // Blocked distributor
  if (status === "true") {
    return (
      <DashboardLayout role="distributor" display={false}>
        <h2>Access Restricted</h2>
        <p>You are blocked by admin</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="distributor" display={true}>
      <h2>Distributor Profile</h2>

      {/* Read-only fields */}
      <label>Username</label>
      <input value={data.username || ""} readOnly />

      <label>Role</label>
      <input value={data.role || ""} readOnly />

      <label>Blocked</label>
      <input value={String(data.block)} readOnly />

      {/* Editable fields */}
      <label>Company Name</label>
      <input
        value={data.companyName || ""}
        onChange={(e) => handleChange("companyName", e.target.value)}
      />

      <label>Region</label>
      <input
        value={data.region || ""}
        onChange={(e) => handleChange("region", e.target.value)}
      />

      <br /><br />
      <button onClick={updateProfile}>Update Profile</button>
    </DashboardLayout>
  );
}
