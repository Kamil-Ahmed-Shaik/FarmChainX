import React, { useState } from 'react';
import axios from 'axios';
import api from '../../api/axiosInstance';

const QualityGrade = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleScan = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8000/quality-grading', {});
            setResult(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 relative z-10">
                <span className="text-emerald-600">🏆</span> Product Quality Score
            </h3>
            <p className="text-gray-500 text-sm mb-6 pr-10">Scan to see the real-time quality grade of this produce based on blockchain logistics data.</p>

            <button
                onClick={handleScan}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-100"
            >
                {loading ? 'Analyzing Data...' : 'Check Quality Score'}
            </button>

            {result && (
                <div className="mt-8 flex items-center gap-6 animate-fade-in-up">
                    <div className="w-24 h-24 bg-emerald-100 rounded-3xl flex items-center justify-center border-2 border-emerald-200">
                        <span className="text-4xl font-black text-emerald-800">{result.grade}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl font-black text-gray-900">{result.quality_score}</span>
                            <span className="text-xs font-bold text-gray-400 capitalize">Quality Index</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(result.attributes).map(([k, v]) => (
                                <span key={k} className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase">
                                    {k}: {v}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QualityGrade;
