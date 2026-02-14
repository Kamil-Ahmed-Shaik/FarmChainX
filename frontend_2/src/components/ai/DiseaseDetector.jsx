import React, { useState } from 'react';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import api from '../../api/axiosInstance';

ChartJS.register(ArcElement, Tooltip, Legend);

const DiseaseDetector = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('file', selectedImage);

        try {
            // Using the new backend endpoint that proxies to AI service
            const response = await axios.post('http://localhost:8000/disease-detection', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(response.data);
        } catch (error) {
            console.error("Error detecting disease:", error);
            alert("Failed to analyze image.");
        } finally {
            setLoading(false);
        }
    };

    // Chart data if confidence is available
    const chartData = result ? {
        labels: ['Confidence', 'Uncertainty'],
        datasets: [
            {
                data: [parseFloat(result.confidence), 100 - parseFloat(result.confidence)],
                backgroundColor: ['#4caf50', '#e0e0e0'],
                borderWidth: 0,
            },
        ],
    } : null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                🌱 AI Disease Detection
            </h3>

            <div className="flex flex-col items-center gap-4">
                <div className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                    {preview ? (
                        <img src={preview} alt="Crop" className="w-full h-full object-cover" />
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                            <span className="text-gray-400 text-sm">Click to upload crop image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    )}
                </div>

                <button
                    onClick={handleUpload}
                    disabled={!selectedImage || loading}
                    className={`w-full py-2 rounded-lg font-semibold transition ${!selectedImage || loading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                        }`}
                >
                    {loading ? 'Analyzing...' : 'Analyze Health'}
                </button>

                {result && (
                    <div className="w-full mt-4 p-4 bg-green-50 rounded-lg border border-green-200 animate-fade-in">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-green-900 text-lg">{result.disease}</h4>
                                <p className="text-sm text-green-700 mt-1">{result.treatment}</p>
                            </div>
                            <div className="w-16 h-16" style={{ marginRight: '20px' }}>
                                <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DiseaseDetector;
