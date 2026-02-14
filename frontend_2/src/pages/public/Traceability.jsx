import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import Header from "../../components/Header";

export default function Traceability() {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('scan');
    const [searchId, setSearchId] = useState("");
    const [traceData, setTraceData] = useState(null);
    const [error, setError] = useState("");
    const [searchType, setSearchType] = useState("id"); // 'id' or 'name'
    const [searchResults, setSearchResults] = useState([]); // For name search results

    useEffect(() => {
        fetchBlockchain();
    }, []);

    const fetchBlockchain = async () => {
        try {
            const response = await axiosInstance.get("/public/blockchain");
            setBlocks(response.data);
        } catch (error) {
            console.error("Error fetching blockchain:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchId) return;

        setError("");
        setTraceData(null);
        setSearchResults([]);

        if (searchType === 'name') {
            try {
                setLoading(true);
                const res = await axiosInstance.get(`/public/crop/search?name=${searchId}`);
                setLoading(false);
                if (res.data && res.data.length > 0) {
                    if (res.data.length === 1) {
                        fetchTraceability(res.data[0].id);
                    } else {
                        setSearchResults(res.data);
                    }
                } else {
                    setError("No crops found with that name");
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
                setError("Error searching for crops");
            }
        } else {
            fetchTraceability(searchId);
        }
    };

    const fetchTraceability = async (id) => {
        setLoading(true);
        setError("");
        setTraceData(null);
        setSearchResults([]);
        try {
            const res = await axiosInstance.get(`/public/crop/${id}/trace`);
            setTraceData(res.data);
        } catch (err) {
            console.error(err);
            setError("Crop journey not found. Please check the ID.");
        } finally {
            setLoading(false);
        }
    };

    const startScanner = () => {
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );
        scanner.render((decodedText) => {
            setSearchId(decodedText);
            // If scanning, it's usually an ID or a URL with ID. 
            // Assuming ID for now.
            setSearchType('id');
            fetchTraceability(decodedText);
            scanner.clear();
        }, () => { });
    };

    const handleFileUpload = (e) => {
        if (e.target.files.length === 0) return;

        const imageFile = e.target.files[0];
        const html5QrCode = new Html5Qrcode("reader-hidden");

        html5QrCode.scanFile(imageFile, true)
            .then(decodedText => {
                setSearchId(decodedText);
                setSearchType('id');
                fetchTraceability(decodedText);
            })
            .catch(err => {
                console.error("Error scanning file", err);
                setError("Could not read QR code from image");
            });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />
            <header className="bg-white border-b border-gray-100 pt-16 pb-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter">
                        FarmChainX <span className="text-emerald-600">Trace</span>
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto font-medium text-lg">
                        Verify the organic journey of your food from farm to table. Powered by immutable blockchain ledger.
                    </p>

                    <div className="flex justify-center mt-12 p-1.5 bg-gray-100 rounded-3xl w-fit mx-auto">
                        <button
                            className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'scan' ? 'bg-white text-emerald-600 shadow-xl' : 'text-gray-400 hover:text-gray-900'}`}
                            onClick={() => setActiveTab('scan')}
                        >
                            🔍 TRACK HARVEST
                        </button>
                        <button
                            className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${activeTab === 'ledger' ? 'bg-white text-emerald-600 shadow-xl' : 'text-gray-400 hover:text-gray-900'}`}
                            onClick={() => setActiveTab('ledger')}
                        >
                            ⛓️ PUBLIC LEDGER
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-16">
                {activeTab === 'scan' && (
                    <div className="animate-fade-in">
                        {!traceData && searchResults.length === 0 && (
                            <div className="bg-white p-12 md:p-20 rounded-[50px] shadow-2xl shadow-gray-200 border border-gray-100 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>

                                <div className="flex justify-center gap-4 mb-6">
                                    <button
                                        type="button"
                                        onClick={() => setSearchType('id')}
                                        className={`px-4 py-2 rounded-full font-bold text-sm transition ${searchType === 'id' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        ID Search
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSearchType('name')}
                                        className={`px-4 py-2 rounded-full font-bold text-sm transition ${searchType === 'name' ? 'bg-emerald-100 text-emerald-700' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        Name Search
                                    </button>
                                </div>

                                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-10 relative z-10">
                                    <input
                                        type={searchType === 'id' ? 'number' : 'text'}
                                        placeholder={searchType === 'id' ? "Enter Crop Trace ID (e.g. 101)" : "Enter Crop Name (e.g. Tomato)"}
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                        className="flex-1 p-6 bg-gray-50 border-2 border-transparent focus:border-emerald-500 rounded-[30px] outline-none text-xl font-black transition"
                                    />
                                    <button type="submit" className="px-10 py-6 bg-gray-900 text-white rounded-[30px] font-black hover:bg-emerald-600 transition shadow-xl">
                                        {loading ? "SEARCHING..." : "TRACE JOURNEY"}
                                    </button>
                                </form>
                                <div className="flex items-center gap-6 mb-10 opacity-30">
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                    <span className="text-[10px] font-black tracking-widest uppercase">SCAN BLOCKCHAIN QR</span>
                                    <div className="flex-1 h-px bg-gray-300"></div>
                                </div>
                                <div id="reader" className="mx-auto mb-8 bg-gray-50 rounded-[40px] overflow-hidden border-4 border-dashed border-gray-100 min-h-[300px] flex items-center justify-center text-gray-300 font-bold italic">
                                    {/* Scanner Render Container */}
                                </div>

                                {/* Hidden container for file scan */}
                                <div id="reader-hidden" style={{ display: 'none' }}></div>

                                <div className="flex flex-col gap-4 items-center">
                                    <button className="flex items-center gap-3 mx-auto px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-[30px] font-black hover:bg-gray-50 transition shadow-lg" onClick={startScanner}>
                                        <span className="text-2xl">📷</span> ACTIVATE CAMERA
                                    </button>

                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="absolute opacity-0 w-full h-full cursor-pointer"
                                        />
                                        <button className="flex items-center gap-3 px-8 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition">
                                            <span>📂</span> Upload QR Image
                                        </button>
                                    </div>
                                </div>

                                {error && <p className="mt-8 text-red-500 font-bold flex items-center justify-center gap-2">⚠️ {error}</p>}
                            </div>
                        )}

                        {searchResults.length > 0 && !traceData && (
                            <div className="bg-white p-10 rounded-[50px] shadow-xl">
                                <h3 className="text-2xl font-black text-gray-900 mb-6">Select a Crop to Trace</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {searchResults.map(crop => (
                                        <div key={crop.id} onClick={() => fetchTraceability(crop.id)} className="p-4 border border-gray-100 rounded-2xl hover:bg-emerald-50 cursor-pointer transition flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden">
                                                <img src={`/uploads/${crop.imagePath}`} className="w-full h-full object-cover" alt={crop.cropName} />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800">{crop.cropName}</p>
                                                <p className="text-sm text-gray-500">ID: {crop.id} • Grade: {crop.qualityGrade}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-8 text-gray-400 hover:text-gray-900 font-bold underline" onClick={() => setSearchResults([])}>Cancel Selection</button>
                            </div>
                        )}

                        {traceData && (
                            <div className="space-y-10 pb-24">
                                <button className="px-6 py-2 bg-white text-gray-400 font-black rounded-full hover:text-emerald-600 shadow-sm transition inline-flex items-center gap-2" onClick={() => { setTraceData(null); setSearchResults([]); }}>
                                    <span>←</span> BACK TO SEARCH
                                </button>

                                <div className="bg-white p-10 md:p-14 rounded-[50px] shadow-2xl shadow-emerald-50 border border-emerald-50 flex flex-col md:flex-row gap-12 items-center">
                                    <div className="w-48 h-48 bg-gray-50 rounded-[40px] overflow-hidden shadow-inner border border-gray-100">
                                        <img src={`/uploads/${traceData.imagePath}`} className="w-full h-full object-cover" alt="Product" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                                            <span className="px-5 py-1.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">{traceData.qualityGrade} Grade</span>
                                            <span className="px-5 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">#{traceData.cropId || traceData.id}</span>
                                            {traceData.verified && <span className="px-5 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">VERIFIED</span>}
                                        </div>
                                        <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">{traceData.cropName}</h2>
                                        <p className="text-gray-400 font-medium text-xl leading-none">Harvested by <span className="text-emerald-600 font-black">{traceData.farmerName}</span> at {traceData.originLocation}</p>
                                    </div>
                                </div>

                                <div className="bg-white p-14 rounded-[50px] shadow-2xl shadow-gray-100 border border-gray-50 relative overflow-hidden">
                                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
                                    <h3 className="text-3xl font-black text-gray-900 mb-16 flex items-center gap-4 relative z-10">
                                        <div className="w-2 h-10 bg-emerald-600 rounded-full"></div>
                                        The Product Journey
                                    </h3>

                                    <div className="relative space-y-16 before:absolute before:left-[24px] before:top-4 before:bottom-4 before:w-1 before:bg-gradient-to-b before:from-emerald-500 before:via-blue-500 before:to-purple-500">
                                        <div className="relative pl-20 group">
                                            <div className="absolute left-0 w-12 h-12 bg-white border-4 border-emerald-500 rounded-full flex items-center justify-center text-xl shadow-xl z-10 transition group-hover:scale-110">🌱</div>
                                            <div className="transition group-hover:translate-x-2">
                                                <h4 className="text-xl font-black text-gray-900 leading-none mb-2">Harvested</h4>
                                                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest">{traceData.harvestDate}</p>
                                                <p className="mt-4 text-gray-500 font-medium leading-relaxed max-w-xl">Initial harvest record created on the blockchain by farmer at {traceData.originLocation}.</p>
                                            </div>
                                        </div>

                                        {traceData.ownershipHistory.map((log) => (
                                            <div key={log.id} className="relative pl-20 group">
                                                <div className="absolute left-0 w-12 h-12 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center text-xl shadow-xl z-10 transition group-hover:scale-110">🔄</div>
                                                <div className="transition group-hover:translate-x-2">
                                                    <h4 className="text-xl font-black text-gray-900 leading-none mb-2">Transfer to {log.ownerRole}</h4>
                                                    <p className="text-xs font-black text-blue-500 uppercase tracking-widest">{log.timestamp?.substring(0, 16).replace("T", " ")}</p>
                                                    <p className="mt-4 text-gray-500 font-medium leading-relaxed max-w-xl">Asset ownership transferred securely to {log.ownerRole} node (Auth ID: {log.ownerId}).</p>
                                                </div>
                                            </div>
                                        ))}

                                        {traceData.shipmentHistory && traceData.shipmentHistory.map((ship) => (
                                            <div key={ship.id} className="relative pl-20 group">
                                                <div className="absolute left-0 w-12 h-12 bg-white border-4 border-purple-500 rounded-full flex items-center justify-center text-xl shadow-xl z-10 transition group-hover:scale-110">🚛</div>
                                                <div className="transition group-hover:translate-x-2">
                                                    <h4 className="text-xl font-black text-gray-900 leading-none mb-2">Logistics Point</h4>
                                                    <p className="text-xs font-black text-purple-500 uppercase tracking-widest">{ship.timestamp?.substring(0, 16).replace("T", " ")}</p>
                                                    <p className="mt-4 text-gray-500 font-medium leading-relaxed max-w-xl">Status <span className="px-3 py-1 bg-purple-50 rounded-lg text-purple-700 font-bold">{ship.status}</span> logged at coordinates {ship.location}.</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-900 p-12 rounded-[50px] text-white overflow-hidden relative group shadow-2xl">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600 rounded-full -mr-48 -mt-48 blur-[100px] opacity-20 group-hover:scale-110 transition duration-700"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-xl">🔐</div>
                                            <div>
                                                <h3 className="text-xl font-black leading-none">Blockchain Proof</h3>
                                                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Immutable Fingerprint</p>
                                            </div>
                                        </div>
                                        <div className="p-6 bg-white/5 rounded-3xl font-mono text-emerald-400 text-xs md:text-sm break-all border border-white/10 shadow-inner">
                                            {traceData.blockchainHash || "PENDING_CONSENSUS_COMMIT"}
                                        </div>
                                        <div className="mt-8 flex items-center gap-4 text-[10px] font-black text-gray-500 tracking-widest uppercase">
                                            <span>Alg: SHA-256</span>
                                            <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                                            <span>Network: Ethereum Mainnet</span>
                                            <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
                                            <span>Consensus: POS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'ledger' && (
                    <div className="space-y-8 pb-24 animate-fade-in">
                        {loading ? (
                            <div className="space-y-6 animate-pulse">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-72 bg-white rounded-[50px]"></div>)}
                            </div>
                        ) : blocks.map((block) => (
                            <div key={block.id} className="bg-white p-10 md:p-14 rounded-[50px] shadow-xl shadow-gray-100 border border-gray-50 hover:shadow-2xl transition-all group">
                                <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                                    <div className="flex-1">
                                        <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${block.type === 'GENESIS' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-blue-50 text-blue-900 border border-blue-100'}`}>
                                            {block.type} BLOCK #{block.indexId}
                                        </span>
                                        <h3 className="text-xl md:text-2xl font-black text-gray-900 mt-6 break-all tracking-tighter leading-none group-hover:text-emerald-600 transition">Hash: {block.hash}</h3>
                                    </div>
                                    <div className="md:text-right flex-shrink-0">
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">TIMESTAMP</p>
                                        <p className="text-lg font-black text-gray-600 leading-none">{block.timestamp}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pt-10 border-t border-gray-50">
                                    <div className="lg:col-span-2">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">PREVIOUS LINK HASH</p>
                                        <p className="text-xs font-mono font-medium text-gray-400 break-all leading-relaxed">{block.previousHash}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">NONCE / WORK</p>
                                        <p className="text-sm font-black text-gray-900">{block.nonce}</p>
                                    </div>
                                    <div className="md:col-span-2 lg:col-span-3 p-8 bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">ENCAPSULATED BLOCK DATA</p>
                                        <pre className="text-sm font-mono text-gray-600 whitespace-pre-wrap leading-relaxed">{block.data}</pre>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
