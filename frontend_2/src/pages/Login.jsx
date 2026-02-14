import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import { login } from "../api/authService";

export default function Login() {
  const [form, setForm] = useState({ role: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!form.role) {
      setError("Please select a role");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await login(form);
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role.toLowerCase());
      localStorage.setItem("userId", res.userId);
      localStorage.setItem("status", res.status);
      navigate(`/${res.role.toLowerCase()}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials or system error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side: Visual/Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden items-center justify-center p-20">
          <div className="absolute top-0 right-0 w-full h-full opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px] animate-pulse delay-700"></div>
          </div>

          <div className="relative z-10 max-w-lg">
            <h1 className="text-7xl font-black text-white mb-8 tracking-tighter leading-none">
              The Future of <span className="text-emerald-500">Agri-Tech</span> is Here.
            </h1>
            <p className="text-gray-400 text-xl font-medium leading-relaxed">
              Join thousands of farmers, distributors, and consumers in a transparent, blockchain-powered ecosystem.
            </p>
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-gray-900 bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">U{i}</div>
                ))}
              </div>
              <p className="text-gray-500 font-bold text-sm tracking-widest uppercase">Trusted by 10k+ Users</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 md:p-16 bg-gray-50/50">
          <div className="w-full max-w-md">
            <div className="mb-12 text-center lg:text-left">
              <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-gray-500 font-medium">Please enter your details to access your dashboard.</p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm animate-shake">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                <input
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-bold text-gray-700 shadow-sm"
                  placeholder="e.g. janesmith"
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

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Account Role</label>
                <select
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition font-bold text-gray-700 shadow-sm appearance-none"
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  required
                >
                  <option value="">Choose your access level...</option>
                  <option value="ADMIN">System Administrator</option>
                  <option value="FARMER">Sustainable Farmer</option>
                  <option value="DISTRIBUTOR">Logistics Distributor</option>
                  <option value="RETAILER">Market Retailer</option>
                  <option value="CONSUMER">General Consumer</option>
                </select>
              </div>

              <div className="pt-4 flex flex-col gap-4">
                <button
                  className={`w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition shadow-xl shadow-gray-200 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-wait' : ''}`}
                  disabled={loading}
                >
                  {loading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
                </button>
                <p className="text-center text-gray-400 font-bold text-sm">
                  New here? <Link to="/register" className="text-emerald-600 hover:underline">Create a free account</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
