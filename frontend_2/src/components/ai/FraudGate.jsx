import React, { useState } from 'react';
import axios from 'axios';
import api from '../../api/axiosInstance';

const FraudDetection = () => {
    const [amount, setAmount] = useState(5000);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/fraud-detection', { amount, avg_amount: 1000 });
            setResult(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-red-500">🛡️</span> Transaction Guard AI
            </h3>
            <p className="text-gray-500 text-sm mb-6">Analyzes transaction patterns to identify potential fraud or anomalies.</p>

            <div className="mb-6">
                <label className="text-sm font-bold text-gray-400 block mb-1">Transaction Amount ($)</label>
                <div className="flex gap-4">
                    <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(parseFloat(e.target.value))}
                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition"
                    />
                    <button
                        onClick={handleCheck}
                        disabled={loading}
                        className={`px-6 bg-gray-900 text-white rounded-xl font-bold transition shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-black'}`}
                    >
                        {loading ? '...' : 'Verify'}
                    </button>
                </div>
            </div>

            {result && (
                <div className={`p-6 rounded-2xl border flex items-center gap-4 animate-fade-in-up ${result.is_fraudulent ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${result.is_fraudulent ? 'bg-red-200 text-red-700' : 'bg-emerald-200 text-emerald-700'}`}>
                        {result.is_fraudulent ? '⚠️' : '✅'}
                    </div>
                    <div>
                        <p className={`font-bold ${result.is_fraudulent ? 'text-red-900' : 'text-emerald-900'}`}>
                            {result.is_fraudulent ? 'High Risk Detected' : 'Transaction Secure'}
                        </p>
                        <p className="text-xs text-gray-500">{result.reason}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FraudDetection;
