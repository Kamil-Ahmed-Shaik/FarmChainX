import React, { useState } from 'react';
import axios from 'axios';
import api from '../../api/axiosInstance';

const AutoRestock = () => {
    const [inputs, setInputs] = useState({ current_stock: 25, sales_velocity: 12 });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/auto-restock', inputs);
            setResult(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-blue-600">📦</span> Auto-Restock Predictor
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="text-sm font-bold text-gray-400 block mb-1">In Stock</label>
                    <input
                        type="number"
                        value={inputs.current_stock}
                        onChange={e => setInputs({ ...inputs, current_stock: parseInt(e.target.value) })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-400 block mb-1">Sales/Day</label>
                    <input
                        type="number"
                        value={inputs.sales_velocity}
                        onChange={e => setInputs({ ...inputs, sales_velocity: parseInt(e.target.value) })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                    />
                </div>
            </div>

            <button
                onClick={handleCheck}
                disabled={loading}
                className={`w-full py-4 bg-gray-900 text-white rounded-2xl font-bold transition shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black'}`}
            >
                {loading ? 'Checking...' : 'Check Inventory Need'}
            </button>

            {result && (
                <div className={`mt-8 p-6 rounded-2xl border text-center animate-fade-in-up ${result.needs_restock ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    <p className={`text-xl font-bold ${result.needs_restock ? 'text-amber-800' : 'text-emerald-800'}`}>
                        {result.needs_restock ? '⚠️ Restock Recommended' : '✅ Stock Level OK'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Inventory will last approx <b>{result.days_left}</b> days.</p>
                    {result.needs_restock && (
                        <div className="mt-4 p-4 bg-white rounded-xl shadow-sm border border-amber-200">
                            <span className="text-xs font-bold text-gray-400 uppercase">Suggested Order</span>
                            <p className="text-2xl font-black text-gray-900">{result.suggested_quantity} Units</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AutoRestock;
