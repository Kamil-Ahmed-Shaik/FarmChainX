import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import "../../styles/Components.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

export default function ConsumerDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        deliveredOrders: 0,
        pendingOrders: 0,
        successRate: 0,
        distributorsUsed: 0,
        retailersAvailable: 0,
        statusDistribution: {},
        spendingOverTime: {}
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const token = localStorage.getItem("token");
                if (userId && token) {
                    const res = await axios.get(`/consumer/dashboard/${userId}/stats`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setStats(res.data);
                }
            } catch (err) {
                console.error("Error fetching dashboard stats", err);
            }
        };
        fetchStats();
    }, []);

    // Prepare chart data
    const statusData = {
        labels: Object.keys(stats.statusDistribution || {}),
        datasets: [
            {
                label: '# of Orders',
                data: Object.values(stats.statusDistribution || {}),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const spendingData = {
        labels: Object.keys(stats.spendingOverTime || {}),
        datasets: [
            {
                label: 'Spending (₹)',
                data: Object.values(stats.spendingOverTime || {}),
                borderColor: 'rgb(16, 185, 129)',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                tension: 0.4,
                fill: true
            },
        ],
    };

    return (
        <DashboardLayout role="consumer" display={true}>
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Consumer <span className="text-emerald-600">Marketplace</span></h2>
                    <p className="text-gray-500 font-medium">Track your farm-fresh orders and manage your profile</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">🛒</div>
                    <div className="text-sm font-semibold text-gray-700">Shopping Active</div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total Orders</h3>
                    <p className="text-3xl font-black text-gray-800">{stats.totalOrders}</p>
                    <p className="text-xs text-gray-500 mt-1">{stats.deliveredOrders} Delivered</p>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Market Access</h3>
                    <p className="text-3xl font-black text-blue-600">{stats.retailersAvailable}</p>
                    <p className="text-xs text-gray-500 mt-1">Retailers Available</p>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Logistics</h3>
                    <p className="text-3xl font-black text-purple-600">{stats.distributorsUsed}</p>
                    <p className="text-xs text-gray-500 mt-1">Distributors Used</p>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Success Rate</h3>
                    <p className="text-3xl font-black text-emerald-600">{stats.successRate}%</p>
                    <p className="text-xs text-gray-500 mt-1">Order Fulfillment</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Order Status Distribution</h3>
                    <div className="h-64 flex items-center justify-center">
                        {Object.keys(stats.statusDistribution || {}).length > 0 ? (
                            <Pie data={statusData} options={{ maintainAspectRatio: false }} />
                        ) : (
                            <p className="text-gray-400">No orders data available</p>
                        )}
                    </div>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Spending</h3>
                    <div className="h-64">
                        {Object.keys(stats.spendingOverTime || {}).length > 0 ? (
                            <Line data={spendingData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400">No spending data available</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 to-emerald-600 shadow-2xl">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-black/10 blur-3xl"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-10 md:p-16 gap-10">
                    <div className="max-w-xl text-center md:text-left">
                        <span className="inline-block py-1 px-3 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md shadow-sm">
                            Fresh from the Farm
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight drop-shadow-md">
                            Taste the difference of <br /> <span className="text-emerald-100">locally grown</span> produce.
                        </h2>
                        <p className="text-lg text-white font-medium mb-8 leading-relaxed drop-shadow-sm opacity-90">
                            Explore verified crops directly from farmers near you. Support local agriculture and enjoy fresher, healthier food.
                        </p>
                        <a href="/consumer/products" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-800 rounded-2xl font-bold hover:bg-emerald-50 hover:scale-105 transition shadow-lg shadow-emerald-900/20">
                            Browse Marketplace <span>→</span>
                        </a>
                    </div>

                    <div className="relative w-full max-w-sm hidden md:block group">
                        <div className="absolute inset-0 bg-emerald-900/20 rounded-2xl transform rotate-3 group-hover:rotate-6 transition duration-500"></div>
                        <img
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600&h=400"
                            alt="Fresh Produce"
                            className="relative rounded-2xl shadow-2xl transform -rotate-3 group-hover:rotate-0 transition duration-500 border-4 border-white/20"
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
