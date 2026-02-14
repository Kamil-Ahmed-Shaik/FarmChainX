import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { register } from "../api/authService";

export default function Register() {
  const [role, setRole] = useState("");
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!role) {
      setError("Please select your role first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register({ ...form, role });
      alert("🎉 Welcome to the network! Registration successful.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Brand Visual */}
        <div className="hidden lg:flex lg:w-1/3 bg-emerald-600 relative overflow-hidden items-center justify-center p-16">
          <div className="absolute top-0 right-0 w-full h-full">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
          </div>

          <div className="relative z-10 text-white">
            <h1 className="text-6xl font-black mb-8 leading-tight tracking-tighter">Grow with <br /> the Best.</h1>
            <p className="text-emerald-50 text-xl font-medium leading-relaxed mb-12">
              Join the most advanced digital agriculture network. From seeds to sales, we've got you covered.
            </p>
            <div className="space-y-6">
              {[
                "Blockchain Verified Security",
                "AI-Driven Smart Analytics",
                "Direct Market Access",
                "24/7 Premium Support"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-[10px]">✓</div>
                  <span className="font-bold tracking-wide">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gray-50/30 overflow-y-auto">
          <div className="w-full max-w-2xl py-12">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Create Account</h2>
              <p className="text-gray-500 font-medium">Join the FarmChainX ecosystem today.</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 font-bold text-sm">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 block mb-2">I am a...</label>
                  <select
                    className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-bold text-gray-700 shadow-sm appearance-none"
                    onChange={e => { setRole(e.target.value); setError(""); }}
                    required
                  >
                    <option value="">Select your role...</option>
                    <option value="FARMER">Farmer (Producer)</option>
                    <option value="DISTRIBUTOR">Distributor (Logistics)</option>
                    <option value="RETAILER">Retailer (Store Owner)</option>
                    <option value="CONSUMER">Consumer (End User)</option>
                    <option value="ADMIN">System Administrator</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                  <input
                    className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-bold text-gray-700 shadow-sm"
                    placeholder="janesmith123"
                    onChange={e => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                  <input
                    className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-bold text-gray-700 shadow-sm"
                    type="password"
                    placeholder="••••••••"
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>

                {/* Conditional Fields based on Role */}
                {role === "FARMER" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Farm Name</label>
                      <input className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-bold text-gray-700 shadow-sm" placeholder="Green Valley Estates" onChange={e => setForm({ ...form, farmName: e.target.value })} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Primary Crop</label>
                      <input className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-bold text-gray-700 shadow-sm" placeholder="Organic Vegetables" onChange={e => setForm({ ...form, cropType: e.target.value })} required />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Farm Address</label>
                      <input className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-bold text-gray-700 shadow-sm" placeholder="123 Farm Road, Ooty, TN" onChange={e => setForm({ ...form, location: e.target.value })} required />
                    </div>
                  </>
                )}

                {role === "DISTRIBUTOR" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Company Name</label>
                      <input className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-bold text-gray-700 shadow-sm" placeholder="AgriLogistics Hub" onChange={e => setForm({ ...form, companyName: e.target.value })} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Operating Region</label>
                      <input className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-bold text-gray-700 shadow-sm" placeholder="South India" onChange={e => setForm({ ...form, region: e.target.value })} required />
                    </div>
                  </>
                )}

                {role === "RETAILER" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Store/Shop Name</label>
                      <input className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-bold text-gray-700 shadow-sm" placeholder="Fresh Mart Pro" onChange={e => setForm({ ...form, shopName: e.target.value })} required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">City/Location</label>
                      <input className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-bold text-gray-700 shadow-sm" placeholder="Bangalore, Karnataka" onChange={e => setForm({ ...form, location: e.target.value })} required />
                    </div>
                  </>
                )}

                {role === "CONSUMER" && (
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-bold text-gray-700 shadow-sm" placeholder="Jane Sylvia Smith" onChange={e => setForm({ ...form, fullName: e.target.value })} required />
                  </div>
                )}

                {role === "ADMIN" && (
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Governance Department</label>
                    <input className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-bold text-gray-700 shadow-sm" placeholder="Central Quality & Control" onChange={e => setForm({ ...form, department: e.target.value })} required />
                  </div>
                )}
              </div>

              <div className="pt-6 flex flex-col gap-4">
                <button
                  className={`w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xl hover:bg-emerald-600 transition shadow-2xl shadow-emerald-100 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'CREATING ACCOUNT...' : 'JOIN THE NETWORK'}
                </button>
                <p className="text-center text-gray-400 font-bold text-sm">
                  Already have an account? <Link to="/login" className="text-emerald-600 hover:underline">Sign in instead</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
