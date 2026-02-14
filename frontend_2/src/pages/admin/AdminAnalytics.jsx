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
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

export default function AdminAnalytics() {
    const [stats, setStats] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [cropTrends, setCropTrends] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = { Authorization: `Bearer ${token}` };

                const statsRes = await axios.get("/analytics/stats", { headers });
                const userRes = await axios.get("/analytics/admin/users", { headers });
                const cropRes = await axios.get("/analytics/crops/trends", { headers });

                setStats(statsRes.data);
                setUserStats(userRes.data);
                setCropTrends(cropRes.data);
            } catch (err) {
                console.error("Error fetching analytics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading">Loading Analytics...</div>;

    const userChartData = {
        labels: Object.keys(userStats || {}),
        datasets: [
            {
                label: 'Users by Role',
                data: Object.values(userStats || {}),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const cropChartData = {
        labels: Object.keys(cropTrends?.counts || {}),
        datasets: [
            {
                label: 'Crop Quantity (Listings)',
                data: Object.values(cropTrends?.counts || {}),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Avg Price (10x scaled)',
                data: Object.values(cropTrends?.avgPrices || {}).map(p => p / 10), // Scale down for visibility
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
        ],
    };

    return (
        <DashboardLayout role="admin" display={true}>
            <header className="dashboard-header">
                <h2 className="dashboard-title">📊 System Analytics</h2>
                <p className="dashboard-subtitle">Real-time overview of platform performance</p>
            </header>

            <div className="analytics-grid">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="big-number">{stats?.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Crops</h3>
                    <p className="big-number">{stats?.totalCrops}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="big-number">{stats?.totalOrders}</p>
                </div>
                <div className="stat-card">
                    <h3>Blockchain Blocks</h3>
                    <p className="big-number">{stats?.blockchainLength}</p>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-wrapper">
                    <h3>User Distribution</h3>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        <Pie data={userChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="chart-wrapper">
                    <h3>Crop Trends (Vol & Price)</h3>
                    <div style={{ height: '300px' }}>
                        <Bar data={cropChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
