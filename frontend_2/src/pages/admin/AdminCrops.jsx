import { useEffect, useState, useCallback } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import "../../styles/Components.css";

export default function AdminCrops() {
  const status = localStorage.getItem("status");
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);

  const fetchCrops = useCallback(async () => {
    try {
      const res = await axios.get("/admin/crops");
      setCrops(res.data || []);
    } catch (error) {
      console.error("Error fetching admin crops:", error);
    }
  }, []);

  useEffect(() => {
    fetchCrops();
  }, [fetchCrops]);

  const acceptCrop = async (id) => {
    try {
      await axios.post(`/admin/crops/${id}/verify`);
      alert("Crop Accepted");
      fetchCrops();
      setSelectedCrop(null);
    } catch (error) {
      console.error("Error accepting crop:", error);
    }
  };

  const rejectCrop = async (id) => {
    try {
      await axios.post(`/admin/crops/${id}/reject`);
      alert("Crop Rejected");
      fetchCrops();
      setSelectedCrop(null);
    } catch (error) {
      console.error("Error rejecting crop:", error);
    }
  };

  if (status !== "false") {
    return (
      <DashboardLayout role="admin" display={false}>
        <div className="flex flex-col items-center justify-center p-10">
          <h2 className="text-2xl font-bold text-red-600">Access Blocked</h2>
          <p className="text-gray-500">Please contact the administrator.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin" display={true}>
      <header className="dashboard-header flex justify-between items-center mb-8">
        <div>
          <h2 className="dashboard-title">Crop Verification</h2>
          <p className="text-gray-500 mt-1">Review and approve crops pending for marketplace</p>
        </div>
      </header>

      <div className="product-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.length > 0 ? (
          crops.map((crop) => (
            <div
              key={crop.id}
              className="product-card p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setSelectedCrop(crop)}
            >
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={`/uploads/${crop.imagePath}`}
                  alt={crop.cropName}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${crop.crop_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-700' :
                    crop.crop_status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                  }`}>
                  {crop.crop_status}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-gray-900">{crop.cropName}</h4>
                <p className="text-sm text-gray-600">👤 Farmer: <span className="font-medium">{crop.username}</span></p>
                <div className="flex justify-between items-center pt-2 border-t border-gray-50 text-xs text-gray-400">
                  <span>₹{crop.price}</span>
                  <span>Qty: {crop.quantity} kg</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 w-full" style={{ gridColumn: '1 / -1' }}>
            <p className="text-gray-400 text-lg">No pending crops for verification 🌾</p>
          </div>
        )}
      </div>

      {selectedCrop && (
        <div className="overlay fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="overlay-box bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              className="overlay-close absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setSelectedCrop(null)}
            >
              ✕
            </button>

            <div className="overlay-content p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="overlay-section space-y-4">
                <h3 className="text-xl font-bold text-emerald-800 border-b pb-2">Farmer Details</h3>
                <div className="space-y-2 text-gray-700">
                  <p><b>Name:</b> {selectedCrop.username}</p>
                  <p><b>Farm Name:</b> {selectedCrop.farmName}</p>
                  <p><b>Crop Type:</b> {selectedCrop.cropType}</p>
                  <p><b>Mobile:</b> {selectedCrop.mobile}</p>
                  <p><b>Acres:</b> {selectedCrop.acres}</p>
                  <p><b>Aadhar:</b> {selectedCrop.aadhar}</p>
                </div>
              </div>

              <div className="overlay-section space-y-4">
                <h3 className="text-xl font-bold text-emerald-800 border-b pb-2">Crop Details</h3>
                <img
                  src={`/uploads/${selectedCrop.imagePath}`}
                  alt="crop"
                  className="w-full h-48 object-cover rounded-xl shadow-inner"
                />
                <div className="space-y-2 text-gray-700">
                  <p><b>Name:</b> {selectedCrop.cropName}</p>
                  <p><b>Quantity:</b> {selectedCrop.quantity} kg</p>
                  <p><b>Harvest Date:</b> {selectedCrop.harvestDate}</p>
                  <p><b>Quality:</b> {selectedCrop.qualityGrade}</p>
                  <p><b>Price:</b> ₹{selectedCrop.price}</p>
                  <p><b>Blockchain:</b> <code className="text-[10px] bg-gray-100 p-1 rounded break-all">{selectedCrop.blockchainHash}</code></p>
                </div>
                <div className="pt-4 flex gap-4">
                  <a
                    href={`https://www.google.com/maps?q=${selectedCrop.latitude},${selectedCrop.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-semibold"
                  >
                    📍 View Farm Map
                  </a>
                </div>
              </div>
            </div>

            <div className="overlay-footer p-6 bg-gray-50 flex gap-4 border-t sticky bottom-0">
              <button
                className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-bold shadow-lg"
                onClick={() => rejectCrop(selectedCrop.id)}
              >
                ❌ Reject Crop
              </button>
              <button
                className="flex-1 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-bold shadow-lg"
                onClick={() => acceptCrop(selectedCrop.id)}
              >
                ✅ Verify & Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}