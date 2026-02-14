import React, { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axiosInstance from "../../api/axiosInstance";
import DiseaseDetector from "../../components/ai/DiseaseDetector";
import YieldPredictor from "../../components/ai/YieldPredictor";
import PriceAdvisor from "../../components/ai/PriceAdvisor";

export default function FarmerDashboard() {
  const status = localStorage.getItem("status");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axiosInstance.get("/analytics/stats").then(res => setStats(res.data));
  }, []);

  return status === "false" ? (
    <DashboardLayout role="farmer" display={true}>
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Farmer <span className="text-emerald-600">Overview</span></h2>
          <p className="text-gray-500 font-medium">Analyze your crops and market presence.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">👨‍🌾</div>
          <div className="text-sm font-semibold text-gray-700">Welcome back, Farmer</div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-6 mb-12">
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Crops</h3>
          <p className="text-4xl font-black text-emerald-700">{stats?.totalCrops || 0}</p>
        </div>
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Blockchain Blocks</h3>
          <p className="text-4xl font-black text-blue-700">{stats?.blockchainLength || 0}</p>
        </div>
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Active Users</h3>
          <p className="text-4xl font-black text-purple-700">{stats?.totalUsers || 0}</p>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-12"></div>

      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-sm">AI</div>
          <h2 className="text-2xl font-bold text-gray-800">Advanced AI Assist</h2>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Row 1 */}
          <div className="space-y-8">
            <DiseaseDetector />
          </div>
          <div className="space-y-8">
            <PriceAdvisor />
          </div>

          {/* Row 2 */}
          <div className="space-y-8">
            <YieldPredictor />
          </div>
          <div className="space-y-8">
            <div className="p-8 bg-gradient-to-br from-emerald-800 to-emerald-950 rounded-3xl text-white shadow-xl relative overflow-hidden group h-full flex flex-col justify-center border border-emerald-700/30">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/20 rounded-full group-hover:scale-150 transition-transform duration-700 blur-2xl"></div>
              <div className="absolute top-10 right-10 w-20 h-20 bg-emerald-400/10 rounded-full blur-xl"></div>

              <h3 className="text-2xl font-black mb-4 relative z-10 leading-tight drop-shadow-md">Maximize Your Profit</h3>
              <p className="text-emerald-50 font-medium mb-8 leading-relaxed relative z-10 text-lg drop-shadow-sm opacity-95">Our AI models analyze real-time market trends to provide you with the best selling prices for your crops.</p>

              <button className="px-8 py-4 bg-white text-emerald-900 rounded-2xl font-black hover:bg-emerald-50 hover:scale-105 transition shadow-lg w-fit relative z-10 flex items-center gap-2">
                <span>View Reports</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  ) : (
    <DashboardLayout role="farmer" display={false}>
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white rounded-3xl border border-red-100 shadow-sm p-12 text-center">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mb-6 pulse">🚫</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Farmer</h2>
        <p className="text-red-500 font-medium text-lg">Your account is currently restricted by administration.</p>
        <button className="mt-8 px-6 py-2 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition">Contact Support</button>
      </div>
    </DashboardLayout>
  );
}
