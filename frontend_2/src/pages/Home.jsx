import Header from "../components/Header";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-40 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-50 via-white to-blue-50 -z-10"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30"></div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
            The Future of <span className="text-emerald-600">Agriculture</span> is Here.
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            FarmChainX leverages AI and Blockchain to create a transparent, efficient, and fair supply chain for farmers, distributors, and consumers.
          </p>

          <div className="flex flex-row justify-center items-center gap-4">
            <Link to="/login" className="px-6 py-3 bg-emerald-600 text-white rounded-full font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-105 transition duration-300">
              Get Started Now
            </Link>
            <Link to="/traceability" className="px-6 py-3 bg-white text-gray-800 rounded-full font-bold border border-gray-200 shadow-sm hover:bg-gray-50 transition duration-300">
              Track Produce
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Powerful Features for Everyone</h2>
            <p className="text-gray-500">Integrating cutting-edge AI to maximize value at every step.</p>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-2xl transition duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 text-3xl mb-6">🌱</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Farmer AI Assist</h3>
              <p className="text-gray-600 leading-relaxed">Disease detection, yield forecasting, and soil health analysis at your fingertips.</p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-2xl transition duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-3xl mb-6">⛓️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Blockchain Trust</h3>
              <p className="text-gray-600 leading-relaxed">Immutable transparency from the farm to the fork. Know exactly where your food comes from.</p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-2xl transition duration-300 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 text-3xl mb-6">🚛</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Logistics</h3>
              <p className="text-gray-600 leading-relaxed">Route optimization and demand forecasting to minimize waste and maximize efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-20 bg-emerald-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-6xl text-emerald-500 font-serif leading-none italic mb-4 block">"</span>
          <p className="text-2xl md:text-3xl font-medium mb-8 leading-snug">
            FarmChainX isn't just a platform; it's a movement towards a more sustainable and equitable localized food system.
          </p>
          <div className="font-bold text-emerald-400">The FarmChainX Team</div>
        </div>
      </section>

      {/* Footer Placeholder */}
      <footer className="py-12 bg-gray-900 text-white text-center">
        <p>&copy; 2026 FarmChainX. Building trust in every byte.</p>
      </footer>
    </div>
  );
}
