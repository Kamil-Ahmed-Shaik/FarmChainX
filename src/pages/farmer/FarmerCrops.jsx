import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import "../../styles/crop-ui.css";

export default function FarmerCrops() {
  const farmerId = localStorage.getItem("userId");

  const [activeTab, setActiveTab] = useState("mycrops");
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [trace, setTrace] = useState([]);

  const [newCrop, setNewCrop] = useState({
    cropName: "",
    quantity: "",
    harvestDate: "",
    qualityGrade: ""
  });

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    const res = await axios.get(`/farmer/crops/${farmerId}`);
    setCrops(res.data);
  };

  const openCrop = async (crop) => {
    setSelectedCrop(crop);
    const traceRes = await axios.get(`/trace/${crop.id}`);
    setTrace(traceRes.data);
  };

  const submitCrop = async (e) => {
    e.preventDefault();
    await axios.post(`/farmer/crops/${farmerId}`, newCrop);
    alert("Crop added!");

    setNewCrop({ cropName: "", quantity: "", harvestDate: "", qualityGrade: "" });
    setActiveTab("mycrops");
    fetchCrops();
  };

  return (
    <DashboardLayout role="farmer" display={true}>
      <h2>Farmer Crops</h2><br/><hr/><br/>

      <div className="tabs">
        <button
          className={activeTab === "mycrops" ? "active" : ""}
          onClick={() => setActiveTab("mycrops")}
        >
          My Crops
        </button>

        <button
          className={activeTab === "newcrop" ? "active" : ""}
          onClick={() => setActiveTab("newcrop")}
        >
          New Crop
        </button>
      </div>

      {activeTab === "mycrops" && (
        <div className="crop-list">
          {crops.map(c => (
            <div key={c.id} className="crop-card" onClick={() => openCrop(c)}>
              <h3>{c.cropName}</h3>
              <p>Harvest: {c.harvestDate}</p>
              <p>Status: {c.status}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "newcrop" && (
        <form className="crop-form" onSubmit={submitCrop}>
          <input placeholder="Crop Name"
            value={newCrop.cropName}
            onChange={e => setNewCrop({ ...newCrop, cropName: e.target.value })}
            required
          />

          <input type="number" placeholder="Quantity"
            value={newCrop.quantity}
            onChange={e => setNewCrop({ ...newCrop, quantity: e.target.value })}
            required
          />

          <input type="date"
            value={newCrop.harvestDate}
            onChange={e => setNewCrop({ ...newCrop, harvestDate: e.target.value })}
            required
          />

          <select
            value={newCrop.qualityGrade}
            onChange={e => setNewCrop({ ...newCrop, qualityGrade: e.target.value })}
            required
          >
            <option value="">Select Quality</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>

          <button>Add Crop</button>
        </form>
      )}

      {selectedCrop && (
        <div className="overlay">
          <div className="overlay-box">
            <button className="close-btn" onClick={() => setSelectedCrop(null)}>
              X
            </button>

            <div>
              <h3>Crop Details</h3>
              <p>Name: {selectedCrop.cropName}</p>
              <p>Qty: {selectedCrop.quantity}</p>
              <p>Harvest: {selectedCrop.harvestDate}</p>
              <p>Status: {selectedCrop.status}</p>
            </div>

            <div>
              <h3>Trace History</h3>
              {trace.map(t => (
                <div key={t.id} className="trace-item">
                  <p>{t.ownerRole} ({t.username})</p>
                  <small>{t.timestamp}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
