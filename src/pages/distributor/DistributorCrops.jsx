import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import "../../styles/crop-ui.css";

export default function DistributorCrops() {
  const distributorId = localStorage.getItem("userId");
  const status = localStorage.getItem("status");

  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [trace, setTrace] = useState([]);

  useEffect(() => {
    axios.get("/distributor/market")
      .then(res => setCrops(res.data));
  }, []);

  const openCrop = async (crop) => {
    setSelectedCrop(crop);
    const traceRes = await axios.get(`/trace/${crop.id}`);
    setTrace(traceRes.data);
  };

  const buyCrop = async (cropId) => {
    await axios.post(`/distributor/buy/${cropId}/${distributorId}`);
    alert("Crop purchased!");
    window.location.reload();
  };

  return status === "false" ? (
    <DashboardLayout role="distributor" display={true}>
      <h2>Crop Marketplace</h2>

      <div className="market-grid">
        {crops.map(c => (
          <div key={c.id} className="crop-card" onClick={() => openCrop(c)}>
            <h3>{c.cropName}</h3>
            <p>Farmer: {c.farmerId}</p>
            <p>Qty: {c.quantity} kg</p>
            <p>Status: {c.status}</p>

            <button
              className="buy-btn"
              onClick={(e) => {
                e.stopPropagation();
                buyCrop(c.id);
              }}
            >
              Buy
            </button>
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
              <h3>Product Details</h3>
              <p>{selectedCrop.cropName}</p>
              <p>Harvest: {selectedCrop.harvestDate}</p>
              <p>Quality: {selectedCrop.qualityGrade}</p>
              <p>Blockchain: {selectedCrop.blockchainHash}</p>
            </div>

            <div>
              <h3>Trace History</h3>
              {trace.map(t => (
                <p key={t.id}>
                  {t.ownerRole} ({t.username})<br/>
                  <small>{t.timestamp}</small>
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  ) : (
    <DashboardLayout role="distributor" display={false}>
      <h2>Blocked</h2>
      <p>You are blocked by admin</p>
    </DashboardLayout>
  );
}
