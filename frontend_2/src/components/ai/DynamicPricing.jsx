import React, { useState } from 'react';
import axios from 'axios';
import api from '../../api/axiosInstance';

const DynamicPricing = () => {
    const [inputs, setInputs] = useState({ days_until_expiry: 5, base_price: 15.0 });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/dynamic-pricing', inputs);
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
                <span className="text-emerald-600">🏷️</span> Dynamic Pricing
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="text-sm font-bold text-gray-400 block mb-1">Days to Expiry</label>
                    <input
                        type="number"
                        value={inputs.days_until_expiry}
                        onChange={e => setInputs({ ...inputs, days_until_expiry: parseInt(e.target.value) })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    />
                </div>
                <div>
                    <label className="text-sm font-bold text-gray-400 block mb-1">Base Price ($)</label>
                    <input
                        type="number"
                        value={inputs.base_price}
                        onChange={e => setInputs({ ...inputs, base_price: parseFloat(e.target.value) })}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    />
                </div>
            </div>

            <button
                onClick={handleCalculate}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition shadow-lg"
            >
                {loading ? 'Calculating...' : 'Calculate Optimal Price'}
            </button>

            {result && (
                <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center animate-fade-in-up">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Recommended Sell Price</p>
                    <p className="text-5xl font-black text-emerald-900">₹{result.suggested_price}</p>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-200 text-emerald-800 rounded-full text-xs font-bold">
                        {result.discount_applied} Discount • {result.reason}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DynamicPricing;
