import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../../api/axiosInstance';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DemandForecast = ({ data }) => {
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (data && Object.keys(data).length > 0) {
            // Transform prop data to forecast format
            const transformed = Object.entries(data).map(([crop, count]) => ({
                crop,
                demand_score: count, // Using count as score for now
                trend: count > 5 ? 'Rising' : 'Stable', // Simple logic
                reason: 'Based on recent delivery data'
            }));
            setForecast(transformed);
        } else {
            handleFetch();
        }
    }, [data]);

    const handleFetch = async () => {
        // ... existing fetch logic ...
        // If external service is down, maybe show empty or mock?
        // keeping existing logic as fallback
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/demand-forecasting', {});
            setForecast(res.data.forecast);
        } catch (error) {
            console.warn("AI Service unavailable, using mock/empty data");
            // Optional: set some mock data if fetch fails
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: forecast.map(f => f.crop),
        datasets: [{
            label: 'Delivered Qty / Demand Score',
            data: forecast.map(f => f.demand_score),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 2,
            borderRadius: 8,
        }]
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-blue-600">📊</span> Demand Forecasting
                </h3>
                <button onClick={handleFetch} disabled={loading} className="text-sm font-bold text-blue-600 hover:text-blue-700 transition">
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            <div className="h-64 mb-6">
                <Bar data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
            </div>

            <div className="space-y-4">
                {forecast.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                            <span className="font-bold text-gray-900">{f.crop}</span>
                            <p className="text-xs text-gray-500">{f.reason}</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-sm font-bold ${f.trend === 'Rising' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {f.trend === 'Rising' ? '📈' : '📉'} {f.trend}
                            </span>
                            <p className="text-xs font-black text-gray-400">{f.demand_score}% Demand</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DemandForecast;
