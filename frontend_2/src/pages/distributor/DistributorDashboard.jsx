import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import RouteOptimizer from "../../components/ai/RouteOptimizer";
import DemandForecast from "../../components/ai/DemandForecast";
import axios from "../../api/axiosInstance";

export default function DistributorDashboard() {
  const status = localStorage.getItem("status");
  const distributorId = localStorage.getItem("userId");
  const [stats, setStats] = useState({
    activeDeliveries: 0,
    ordersReceived: 0,
    ordersDelivered: 0,
    efficiencyBoost: "0%",
    demandForecast: {}
  });

  useEffect(() => {
    if (distributorId) {
      fetchStats();
    }
  }, [distributorId]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`/distributor/dashboard/${distributorId}/stats`);
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching dashboard stats", err);
    }
  };

  return status === "false" ? (
    <DashboardLayout role="distributor" display={true}>
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Distributor <span className="text-blue-600">Portal</span></h2>
          <p className="text-gray-500 font-medium">Logistics & Market Forecasting</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">🚛</div>
          <div className="text-sm font-semibold text-gray-700">Market Operational</div>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Efficiency Boost</h3>
            <p className="text-3xl font-black text-emerald-600">{stats.efficiencyBoost}</p>
          </div>
          <div className="text-4xl">⚡</div>
        </div>
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Active Deliveries</h3>
            <p className="text-3xl font-black text-blue-600">{stats.activeDeliveries}</p>
          </div>
          <div className="text-4xl">📦</div>
        </div>
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Received</h3>
            <p className="text-3xl font-black text-indigo-600">{stats.ordersReceived}</p>
          </div>
          <div className="text-4xl">📥</div>
        </div>
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Delivered</h3>
            <p className="text-3xl font-black text-purple-600">{stats.ordersDelivered}</p>
          </div>
          <div className="text-4xl">✅</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <RouteOptimizer />
        </div>
        <div className="space-y-8">
          <DemandForecast data={stats.demandForecast} />
        </div>
      </div>
    </DashboardLayout>
  ) : (
    <DashboardLayout role="distributor" display={false}>
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-red-100 shadow-sm p-12 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mb-6">🚫</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Account Suspended</h2>
        <p className="text-red-500 font-medium">Please contact the administrator for more information.</p>
      </div>
    </DashboardLayout>
  );
}
