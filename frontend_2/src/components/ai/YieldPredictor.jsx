import React, { useState } from 'react';
import axios from 'axios';
import api from '../../api/axiosInstance';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const YieldPredictor = () => {
    const [formData, setFormData] = useState({
        cropType: 'corn',
        acreage: 10,
        soilPh: 6.5,
        rainfall: 800
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePredict = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/yield-prediction', {
                crop_type: formData.cropType,
                acreage: parseFloat(formData.acreage),
                soil_ph: parseFloat(formData.soilPh),
                rainfall: parseFloat(formData.rainfall)
            });
            setPrediction(response.data);
        } catch (error) {
            console.error("Prediction error:", error);
            alert("Failed to predict yield.");
        } finally {
            setLoading(false);
        }
    };

    const chartData = prediction ? {
        labels: ['Predicted Yield (Tons)'],
        datasets: [
            {
                label: 'Harvest Estimate',
                data: [prediction.predicted_yield_tons],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    } : null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                🌾 Yield Prediction
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Crop Type</label>
                    <select name="cropType" value={formData.cropType} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border">
                        <option value="corn">Corn</option>
                        <option value="wheat">Wheat</option>
                        <option value="rice">Rice</option>
                        <option value="soybean">Soybean</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Acreage</label>
                    <input type="number" name="acreage" value={formData.acreage} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Soil pH</label>
                    <input type="number" step="0.1" name="soilPh" value={formData.soilPh} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Rainfall (mm)</label>
                    <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
                </div>
            </div>

            <button
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition mb-4"
            >
                {loading ? 'Calculating...' : 'Predict Yield'}
            </button>

            {prediction && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Expected Harvest:</span>
                        <span className="text-2xl font-bold text-blue-800">{prediction.predicted_yield_tons} Tons</span>
                    </div>
                    <div className="h-32 w-full">
                        <Bar data={chartData} options={{ maintainAspectRatio: false, indexAxis: 'y' }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default YieldPredictor;
