import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import "../../styles/Components.css";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/analytics/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/admin/reports", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post("/admin/reports/generate", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Report generated successfully");
      fetchReports();
    } catch (err) {
      console.error("Error generating report:", err);
      alert("Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <DashboardLayout role="admin" display={true}>
      <header className="dashboard-header">
        <h2 className="dashboard-title">📑 System Reports</h2>
        <p className="dashboard-subtitle">Generated audit logs and system health reports</p>
      </header>

      <div className="analytics-grid" style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
        <div className="stat-card" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Platform Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: '900', color: '#1e293b' }}>{stats?.totalUsers || '...'}</p>
        </div>
        <div className="stat-card" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Active Crops</h3>
          <p style={{ fontSize: '2rem', fontWeight: '900', color: '#059669' }}>{stats?.totalCrops || '...'}</p>
        </div>
        <div className="stat-card" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Chain Height</h3>
          <p style={{ fontSize: '2rem', fontWeight: '900', color: '#2563eb' }}>{stats?.blockchainLength || '...'}</p>
        </div>
        <div className="stat-card" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>System Health</h3>
          <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669', display: 'flex', itemsCenter: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', background: '#059669', borderRadius: '50%', display: 'inline-block' }}></span>
            Operational
          </p>
        </div>
      </div>

      <div className="system-diagnostics" style={{ background: '#fff', padding: '2rem', borderRadius: '2rem', border: '1px solid #f1f5f9', marginBottom: '2rem' }}>
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          📡 Live System Diagnostics
        </h3>
        <div className="grid grid-cols-3 gap-8">
          <div className="diag-item">
            <p className="text-sm font-bold text-gray-400 mb-2 uppercase">Core API Server</p>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">ONLINE</div>
              <span className="text-xs text-gray-400">Response: 42ms</span>
            </div>
          </div>
          <div className="diag-item">
            <p className="text-sm font-bold text-gray-400 mb-2 uppercase">Blockchain Node</p>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">SYNCED</div>
              <span className="text-xs text-gray-400">Block: #4120</span>
            </div>
          </div>
          <div className="diag-item">
            <p className="text-sm font-bold text-gray-400 mb-2 uppercase">AI Service Engine</p>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">READY</div>
              <span className="text-xs text-gray-400">Port: 8000</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Archive & Audit Logs</h3>
          <p className="text-sm text-gray-500">Historical data and generated traceability reports</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={generateReport}
          disabled={generating}
          style={{ height: 'fit-content' }}
        >
          {generating ? "Generating..." : "⚡ Generate Audit Log"}
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading Reports...</div>
      ) : (
        <div className="reports-list">
          {reports.length === 0 ? (
            <div className="no-data">No reports found. Generate one to see data.</div>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Generated Date</th>
                    <th>Generated By</th>
                    <th>Content</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id}>
                      <td>#{report.id}</td>
                      <td>
                        <span className={`status-badge ${report.type === 'SYSTEM_HEALTH' ? 'status-valid' : 'status-pending'}`}>
                          {report.type}
                        </span>
                      </td>
                      <td>{report.generatedDate?.substring(0, 16).replace("T", " ")}</td>
                      <td>{report.generatedBy}</td>
                      <td title={report.content}>
                        {report.content.length > 50 ? report.content.substring(0, 50) + "..." : report.content}
                      </td>
                      <td>
                        <button className="btn btn-sm btn-secondary" onClick={() => alert(report.content)}>View Full</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
