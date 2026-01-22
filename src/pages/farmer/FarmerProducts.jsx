import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";

export default function FarmerProducts() {
  const status = localStorage.getItem("status");
  const farmerId = localStorage.getItem("userId");

  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [trace, setTrace] = useState([]);

  useEffect(() => {
    axios.get(`/farmer/buy/crops/${farmerId}`)
      .then(res => setCrops(res.data));
  }, [farmerId]);

  const openCrop = async (crop) => {
    setSelectedCrop(crop);
    const traceRes = await axios.get(`/trace/${crop.id}`);
    setTrace(traceRes.data);
  };

  const buyCrop = async (cropId) => {
    await axios.post(`/farmer/transfer/${cropId}/${farmerId}`);
    alert("Crop purchased successfully!");
    window.location.reload();
  };

  return status === "false" ? (
    <DashboardLayout role="farmer" display={true}>
      <h2>Available Crops</h2>

      {crops.map(c => (
        <div key={c.id} className="crop-card" onClick={() => openCrop(c)}>
          <h3>{c.cropName}</h3>
          <p>Quantity: {c.quantity} kg</p>
          <p>Status: {c.status}</p>
          <button onClick={(e) => {
            e.stopPropagation();
            buyCrop(c.id);
          }}>Buy</button>
        </div>
      ))}

      {selectedCrop && (
        <div className="overlay">
          <div className="overlay-box">
            <h3>{selectedCrop.cropName}</h3>
            <p>Harvest Date: {selectedCrop.harvestDate}</p>
            <p>Quality: {selectedCrop.qualityGrade}</p>

            <h4>Trace History</h4>
            {trace.map(t => (
              <p key={t.id}>
                {t.ownerRole} ({t.username}) - {t.timestamp}
              </p>
            ))}

            <button onClick={() => setSelectedCrop(null)}>Close</button>
          </div>
        </div>
      )}
    </DashboardLayout>
  ) : (
    <DashboardLayout role="farmer" display={false}>
      <h2>Blocked</h2>
      <p>You are blocked by admin</p>
    </DashboardLayout>
  );
}
