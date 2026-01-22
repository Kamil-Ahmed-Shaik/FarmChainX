import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";

export default function FarmerProfile() {
  const userId = localStorage.getItem("userId");
  const status = localStorage.getItem("status"); // true / false as string

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch farmer profile
  useEffect(() => {
    axios
      .get(`/farmer/${userId}/profile`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Profile fetch error:", err);
        setLoading(false);
      });
  }, [userId]);

  // Handle field change
  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  // Update profile
  const updateProfile = async () => {
    try {
      await axios.post(`/farmer/${userId}/profile`, data);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Update failed");
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout role="farmer">
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  // Blocked farmer view
  if (status === "true") {
    return (
      <DashboardLayout role="farmer" display={false}>
        <h2>Access Restricted</h2>
        <p>You are blocked by Admin</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="farmer" display={true}>
      <h2>Farmer Profile</h2>

      {/* Read-only fields */}
      <label>Username</label>
      <input value={data.username || ""} readOnly />

      <label>Role</label>
      <input value={data.role || ""} readOnly />

      <label>Blocked</label>
      <input value={String(data.block)} readOnly />

      <label>Status</label>
      <input value={data.status || ""} readOnly />

      {/* Editable fields */}
      <label>Farm Name</label>
      <input
        value={data.farmName || ""}
        onChange={(e) => handleChange("farmName", e.target.value)}
      />

      <label>Crop Type</label>
      <input
        value={data.cropType || ""}
        onChange={(e) => handleChange("cropType", e.target.value)}
      />

      <label>Location</label>
      <input
        value={data.location || ""}
        onChange={(e) => handleChange("location", e.target.value)}
      />

      <label>Farm Location</label>
      <input
        value={data.farmLocation || ""}
        onChange={(e) => handleChange("farmLocation", e.target.value)}
      />

      <label>Mobile</label>
      <input
        value={data.mobile || ""}
        onChange={(e) => handleChange("mobile", e.target.value)}
      />

      <label>Acres</label>
      <input
        type="number"
        value={data.acres || ""}
        onChange={(e) => handleChange("acres", e.target.value)}
      />

      <label>Expected Yield</label>
      <input
        value={data.expectedYield || ""}
        onChange={(e) => handleChange("expectedYield", e.target.value)}
      />

      <label>Soil Type</label>
      <input
        value={data.soil_type || ""}
        onChange={(e) => handleChange("soil_type", e.target.value)}
      />

      <label>Aadhar</label>
      <input
        value={data.aadhar || ""}
        onChange={(e) => handleChange("aadhar", e.target.value)}
      />

      <label>Latitude</label>
      <input
        value={data.latitude || ""}
        onChange={(e) => handleChange("latitude", e.target.value)}
      />

      <label>Longitude</label>
      <input
        value={data.longitude || ""}
        onChange={(e) => handleChange("longitude", e.target.value)}
      />

      <label>Land Photo URL</label>
      <input
        value={data.landPhoto || ""}
        onChange={(e) => handleChange("landPhoto", e.target.value)}
      />

      <br /><br />
      <button onClick={updateProfile}>Update Profile</button>
    </DashboardLayout>
  );
}
