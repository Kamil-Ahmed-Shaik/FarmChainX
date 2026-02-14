import DashboardLayout from "../../layouts/DashboardLayout";
import FraudGate from "../../components/ai/FraudGate";

export default function AdminDashboard() {
  const status = localStorage.getItem("status");

  return status === "false" ? (
    <DashboardLayout role="admin" display={true}>
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">System <span className="text-red-600">Governance</span></h2>
          <p className="text-gray-500 font-medium">Platform health & Fraud Monitoring</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600 animate-pulse">⚙️</div>
          <div className="text-sm font-semibold text-gray-700">All Systems Normal</div>
        </div>
      </header>

      <div className="grid grid-cols-4 gap-6 mb-12">
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group" onClick={() => window.location.href = '/admin/users'}>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">👥</div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Users</h3>
          <p className="text-2xl font-black text-gray-900">Manage Approvals</p>
        </div>
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group" onClick={() => window.location.href = '/admin/transactions'}>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">💰</div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Audit</h3>
          <p className="text-2xl font-black text-gray-900">Transaction Logs</p>
        </div>
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group" onClick={() => window.location.href = '/admin/disputes'}>
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">⚖️</div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Justice</h3>
          <p className="text-2xl font-black text-gray-900">Resolve Disputes</p>
        </div>
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group" onClick={() => window.location.href = '/admin/reports'}>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">📑</div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Reports</h3>
          <p className="text-2xl font-black text-gray-900">System Analytics</p>
        </div>
      </div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-red-100 to-transparent mb-12"></div>

      <div className="max-w-3xl mx-auto">
        <FraudGate />
      </div>
    </DashboardLayout>
  ) : (
    <DashboardLayout role="admin" display={false}>
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 p-12 text-center">
        <h2 className="text-3xl font-bold text-red-600">Access Denied</h2>
        <p className="mt-4 text-gray-600">You do not have the necessary permissions to view this content.</p>
      </div>
    </DashboardLayout>
  );
}
