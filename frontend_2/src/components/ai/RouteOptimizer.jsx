import React, { useState } from 'react';
import axios from 'axios';
import api from '../../api/axiosInstance';

const RouteOptimizer = () => {
    // Mock locations for demo
    const [locations] = useState([
        { id: '1', name: 'Farm A', lat: 34.05, lng: -118.24 },
        { id: '2', name: 'Distribution Center', lat: 34.06, lng: -118.25 },
        { id: '3', name: 'Retailer X', lat: 34.04, lng: -118.23 },
        { id: '4', name: 'Farm B', lat: 34.07, lng: -118.26 }
    ]);
    const [optimized, setOptimized] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleOptimize = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/route-optimization', { locations });
            setOptimized(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                🚚 AI Route Optimizer
            </h3>

            <div className="flex flex-col md:flex-row gap-6 items-stretch">
                <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col h-full">
                    <h4 className="font-semibold text-gray-600 mb-2">Stops</h4>
                    <ul className="space-y-2 flex-grow">
                        {locations.map((loc, idx) => (
                            <li key={loc.id} className="p-3 bg-white rounded shadow-sm border border-gray-100 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-bold">
                                    {idx + 1}
                                </span>
                                {loc.name}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={handleOptimize}
                        disabled={loading}
                        className="mt-4 w-auto bg-indigo-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition self-start shadow-md"
                    >
                        {loading ? 'Calculating...' : 'Optimize Route'}
                    </button>
                </div>

                <div className="flex-1 bg-indigo-50 rounded-xl p-4 border border-indigo-100 min-h-[200px] flex flex-col h-full">
                    {optimized ? (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-indigo-900">Optimized Path</h4>
                                <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full">
                                    Saved {optimized.fuel_saved_liters}L Fuel
                                </span>
                            </div>
                            <div className="relative flex-grow">
                                {optimized.optimized_route.map((loc, idx) => (
                                    <div key={loc.id} className="flex items-center gap-3 mb-3 last:mb-0 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className="flex flex-col items-center">
                                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md z-10">
                                                {idx + 1}
                                            </div>
                                            {idx < optimized.optimized_route.length - 1 && (
                                                <div className="w-0.5 h-6 bg-indigo-300 -mb-2 mt-1"></div>
                                            )}
                                        </div>
                                        <div className="p-3 bg-white rounded-lg shadow-sm border border-indigo-100 flex-1">
                                            <span className="font-medium text-gray-800">{loc.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-center text-indigo-600 text-sm font-medium pt-4 border-t border-indigo-200">
                                Total Distance: {optimized.total_distance_km} km
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <span className="text-4xl mb-2">🗺️</span>
                            <p>Click optimize to calculate the best route</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RouteOptimizer;
