import React, { useState } from 'react';
import axios from 'axios';
import api from '../../api/axiosInstance';

const PriceAdvisor = () => {
    const [inputs, setInputs] = useState({
        cropName: 'Corn',
        variety: 'Sweet',
        marketTrend: 'stable'
    });
    const [advice, setAdvice] = useState(null);

    const handleRunObj = async () => {
        try {
            const res = await axios.post('http://localhost:8000/smart-pricing', {
                crop_name: inputs.cropName,
                variety: inputs.variety,
                market_trend: inputs.marketTrend
            });
            setAdvice(res.data);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                💰 Smart Price Advisor
            </h3>

            <div className="space-y-3">
                <input
                    type="text"
                    value={inputs.cropName}
                    onChange={e => setInputs({ ...inputs, cropName: e.target.value })}
                    className="w-full p-2 border rounded"
                    placeholder="Crop Name"
                />
                <select
                    value={inputs.marketTrend}
                    onChange={e => setInputs({ ...inputs, marketTrend: e.target.value })}
                    className="w-full p-2 border rounded"
                >
                    <option value="stable">Stable Market</option>
                    <option value="up">Trending Up 📈</option>
                    <option value="down">Trending Down 📉</option>
                </select>

                <button onClick={handleRunObj} className="w-full bg-purple-600 text-white py-2 rounded font-bold">
                    Get Advice
                </button>
            </div>

            {advice && (
                <div className="mt-4 p-4 bg-purple-50 rounded border border-purple-200 text-center">
                    <p className="text-sm text-gray-500">Recommended Price</p>
                    <p className="text-3xl font-extrabold text-purple-700">
                        ₹{advice.suggested_price}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">{advice.market_analysis}</p>
                </div>
            )}
        </div>
    );
};
export default PriceAdvisor;
