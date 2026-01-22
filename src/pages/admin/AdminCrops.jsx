import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import "../../styles/crop-ui.css";

export default function AdminCrops() {
  const status = localStorage.getItem("status");
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    axios.get("/admin/crops")
      .then(res => setCrops(res.data))
      .catch(err => console.error(err));
  }, []);

  const verifyCrop = async (cropId) => {
    await axios.post(`/admin/crops/${cropId}/verify`);
    alert("Crop Verified");

    setCrops(prev =>
      prev.map(c => c.id === cropId ? { ...c, status: "VERIFIED" } : c)
    );

    setSelectedCrop(null);
  };

  if (status !== "false") {
    return (
      <DashboardLayout role="admin" display={false}>
        <h2>Blocked</h2>
        <p>You are blocked by admin</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" display={true}>
      <h2>Crop Verification</h2><br/><hr/><br/>

      <div className={`crop-list ${selectedCrop ? "blur" : ""}`}>
        {crops.map(crop => (
          <div
            key={crop.id}
            className="crop-card"
            onClick={() => setSelectedCrop(crop)}
          >
            <h3>{crop.cropName}</h3>
            <p>Farmer ID: {crop.farmerId}</p>
            <p>Status: {crop.status}</p>
          </div>
        ))}
      </div>

      {selectedCrop && (
        <div className="overlay">
          <div className="overlay-box">
            <button className="close-btn" onClick={() => setSelectedCrop(null)}>
              X
            </button>

            <div>
              <h3>Crop Details</h3>
              <p><b>Name:</b> {selectedCrop.cropName}</p>
              <p><b>Farmer:</b> {selectedCrop.farmerId}</p>
              <p><b>Quantity:</b> {selectedCrop.quantity}</p>
              <p><b>Harvest:</b> {selectedCrop.harvestDate}</p>
              <p><b>Quality:</b> {selectedCrop.qualityGrade}</p>
              <p><b>Status:</b> {selectedCrop.status}</p>
              <p><b>Blockchain Hash:<br/></b> {selectedCrop.blockchainHash}</p>

              {selectedCrop.status === "PENDING" ? (
                <button onClick={() => verifyCrop(selectedCrop.id)}>
                  Verify Crop
                </button>
              ) : (
                <span className="verified-tag">VERIFIED</span>
              )}
            </div>

            <div>
              <h3>Trace History</h3>
              <p>Blockchain based tracking enabled</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
