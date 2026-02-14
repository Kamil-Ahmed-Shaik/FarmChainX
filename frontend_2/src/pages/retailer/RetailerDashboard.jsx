import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import DynamicPricing from "../../components/ai/DynamicPricing";
import AutoRestock from "../../components/ai/AutoRestock";

export default function RetailerDashboard() {
  const status = localStorage.getItem("status");
  const retailerId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({ stockCount: 0, revenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`/retailer/orders/${retailerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Filter only APPROVED/COMPLETED orders (accepted by farmer)
        const accepted = res.data.filter(order =>
          order.orderStatus === "APPROVED" || order.orderStatus === "COMPLETED"
        );

        const stockCount = accepted.length;
        const revenue = accepted
          .filter(order => order.cropStatus === "PUBLISHED")
          .reduce((sum, order) => sum + (order.quantity * order.price), 0);

        setStats({ stockCount, revenue });
      } catch (error) {
        console.error("Error fetching retailer stats:", error);
      }
    };

    if (retailerId) fetchStats();
  }, [retailerId, token]);

  return status === "false" ? (
    <DashboardLayout role="retailer" display={true}>
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Retailer <span className="text-purple-600">Command</span></h2>
          <p className="text-gray-500 font-medium">Inventory & Dynamic Price Management</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">🏪</div>
          <div className="text-sm font-semibold text-gray-700">Store Active</div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-6 mb-12">
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Stock Items</h3>
            <p className="text-3xl font-black text-purple-600">{stats.stockCount}</p>
          </div>
          <div className="text-4xl">🍎</div>
        </div>
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Today's Revenue</h3>
            <p className="text-3xl font-black text-emerald-600">₹{stats.revenue.toLocaleString()}</p>
          </div>
          <div className="text-4xl">💰</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-8">
          <DynamicPricing />
        </div>
        <div className="space-y-8">
          <AutoRestock />
        </div>
      </div>
    </DashboardLayout>
  ) : (
    <DashboardLayout role="retailer" display={false}>
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-red-100 shadow-sm p-12 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mb-6">🚫</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-red-500 font-medium tracking-wide">Your retailer account has been suspended.</p>
        <button className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition">Appeal Suspension</button>
      </div>
    </DashboardLayout>
  );
}
