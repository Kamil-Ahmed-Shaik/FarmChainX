import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const isAuth = location.pathname === "/login" || location.pathname === "/register";

  return (
    <nav className="w-full z-50 transition-all duration-500 sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-emerald-200 group-hover:scale-110 transition">F</div>
          <span className="text-2xl font-black tracking-tighter text-gray-900">FarmChain<span className="text-emerald-600">X</span></span>
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/traceability" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition hover:text-emerald-600">Trace Journey</Link>

          <div className="h-6 w-px bg-gray-200 mx-2"></div>

          <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition">Sign In</Link>

          <Link to="/register" className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-black hover:bg-emerald-600 transition shadow-lg shadow-gray-200">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
