import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";

export default function AdminProfile() {
  const userId = localStorage.getItem("userId");
  const status = localStorage.getItem("status"); // "true" or "false"

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch admin profile
  useEffect(() => {
    axios
      .get(`/admin/${userId}/profile`)
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
      await axios.post(`/admin/${userId}/profile`, data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  // Loading
  if (loading) {
    return (
      <DashboardLayout role="admin">
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  // Blocked admin
  if (status === "true") {
    return (
      <DashboardLayout role="admin" display={false}>
        <h2>Access Restricted</h2>
        <p>You are blocked by Super Admin</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" display={true}>
      <h2>Admin Profile</h2>

      {/* Read-only fields */}
      <label>Username</label>
      <input value={data.username || ""} readOnly />

      <label>Role</label>
      <input value={data.role || ""} readOnly />

      <label>Blocked</label>
      <input value={String(data.block)} readOnly />

      {/* Editable field */}
      <label>Department</label>
      <input
        value={data.department || ""}
        onChange={(e) => handleChange("department", e.target.value)}
      />

      <br /><br />
      <button onClick={updateProfile}>Update Profile</button>
    </DashboardLayout>
  );
}
