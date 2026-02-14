import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import BuyProductModal from "../../components/BuyProductModal";
import ProductDetailsModal from "../../components/ProductDetailsModal";
import ModernProductCard from "../../components/common/ModernProductCard";
import "../../styles/Components.css";
import "../../styles/RetailerProducts.css";

export default function FarmerProducts() {
  const status = localStorage.getItem("status");
  const farmerId = localStorage.getItem("userId");

  const [crops, setCrops] = useState([]);
  const [filteredCrops, setFilteredCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [isBuyModalOpen, setBuyModalOpen] = useState(false);
  const [cropToBuy, setCropToBuy] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchCrops();
  }, [farmerId]);

  useEffect(() => {
    // Filter logic:
    // 1. Exclude own crops (farmerId != product.farmerId)
    // 2. Status must be VERIFIED
    // 3. Search term matching cropName
    const results = crops.filter(crop => {
      const isNotOwn = String(crop.farmerId) !== String(farmerId);
      const isVerified = crop.status === "VERIFIED";
      const matchesSearch = crop.cropName.toLowerCase().includes(searchTerm.toLowerCase());

      return isNotOwn && isVerified && matchesSearch;
    });
    setFilteredCrops(results);
  }, [crops, searchTerm, farmerId]);

  const fetchCrops = () => {
    // Fetching all crops available in the market for farmers (excluding their own logic handled in filter)
    // The endpoint might vary, assuming it returns a list of crops
    axios.get(`/farmer/buy/crops/${farmerId}`).then(res => setCrops(res.data));
  };

  const openDetails = (crop) => {
    setSelectedCrop(crop);
    setDetailsModalOpen(true);
  };

  const handleBuyClick = (crop) => {
    setCropToBuy(crop);
    setBuyModalOpen(true);
  };

  const handleOrderSuccess = () => {
    fetchCrops();
    setBuyModalOpen(false);
  };

  return status === "false" ? (
    <DashboardLayout role="farmer" display={true}>
      <header className="dashboard-header flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="dashboard-title">Available Crops in Market</h2>
          <p className="text-gray-500 mt-1">Browse and buy Verified crops from other farmers</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search by crop name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none transition"
          />
          <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
        </div>
      </header>

      {/* Products Grid */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        {filteredCrops.length > 0 ? (
          filteredCrops.map(product => (
            <ModernProductCard
              key={product.id}
              product={product}
              onDetailsClick={openDetails}
              onBuyClick={handleBuyClick}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
            <span className="text-4xl mb-3 block">🌾</span>
            <p className="text-gray-500 font-medium">No verified crops found matching your search.</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <ProductDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        product={selectedCrop}
      />

      {/* Buy Modal Integration */}
      <BuyProductModal
        isOpen={isBuyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        product={cropToBuy}
        userRole="farmer"
        onOrderSuccess={handleOrderSuccess}
      />

    </DashboardLayout>
  ) : (
    <DashboardLayout role="farmer" display={false}>
      <h2>Blocked</h2>
      <p>You are blocked by admin</p>
    </DashboardLayout>
  );
}
