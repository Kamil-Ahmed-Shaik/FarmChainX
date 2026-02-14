import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import "../../styles/Components.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement
);

export default function FarmerAnalytics() {
    const farmerId = localStorage.getItem("userId");
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState("MONTHS"); // 'DAYS', 'MONTHS', 'YEARS'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`/analytics/farmer/${farmerId}/income?period=${period}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching farmer stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [farmerId, period]);

    if (loading) return (
        <DashboardLayout role="farmer" display={true}>
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        </DashboardLayout>
    );

    const incomeData = {
        labels: Object.keys(stats?.monthlyIncome || {}),
        datasets: [
            {
                label: `Income (${period})`,
                data: Object.values(stats?.monthlyIncome || {}),
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <DashboardLayout role="farmer" display={true}>
            <header className="dashboard-header flex justify-between items-center">
                <div>
                    <h2 className="dashboard-title">📈 Farm Analytics</h2>
                    <p className="dashboard-subtitle">Track your sales and income performance</p>
                </div>
                <div>
                    <select
                        className="px-4 py-2 border rounded-lg bg-white shadow-sm font-medium text-gray-700"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <option value="DAYS">Daily</option>
                        <option value="MONTHS">Monthly</option>
                        <option value="YEARS">Yearly</option>
                    </select>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="stat-card green" style={{ marginBottom: 0 }}>
                    <div className="stat-icon">💰</div>
                    <div className="stat-info">
                        <h3>Total Revenue</h3>
                        <p className="stat-number">₹{stats?.totalIncome.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-wrapper full-width">
                    <h3>Income Trends ({period.toLowerCase()})</h3>
                    <div style={{ height: '400px' }}>
                        <Bar
                            data={incomeData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: (value) => '₹' + value
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
