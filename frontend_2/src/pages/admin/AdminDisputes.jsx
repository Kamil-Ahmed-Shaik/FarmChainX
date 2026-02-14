import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import axios from "../../api/axiosInstance";
import "../../styles/Components.css";

export default function AdminDisputes() {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDispute, setSelectedDispute] = useState(null);
    const [resolutionNotes, setResolutionNotes] = useState("");

    useEffect(() => {
        fetchDisputes();
    }, []);

    const fetchDisputes = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("/admin/disputes", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDisputes(res.data);
        } catch (err) {
            console.error("Error fetching disputes:", err);
        } finally {
            setLoading(false);
        }
    };

    const resolveDispute = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`/admin/disputes/${selectedDispute.id}/resolve`, resolutionNotes, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'text/plain'
                }
            });
            alert("Dispute Resolved");
            setSelectedDispute(null);
            setResolutionNotes("");
            fetchDisputes();
        } catch (err) {
            console.error("Error resolving dispute:", err);
        }
    };

    return (
        <DashboardLayout role="admin" display={true}>
            <header className="dashboard-header">
                <h2 className="dashboard-title">⚖️ Dispute Management</h2>
                <p className="dashboard-subtitle">Resolve conflicts and issues raised by users</p>
            </header>

            {loading ? (
                <div className="loading">Loading Disputes...</div>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Order ID</th>
                                <th>Raised By</th>
                                <th>Role</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {disputes.length === 0 ? (
                                <tr><td colSpan="7" className="text-center">No disputes found</td></tr>
                            ) : disputes.map(d => (
                                <tr key={d.id}>
                                    <td>#{d.id}</td>
                                    <td>#{d.orderId}</td>
                                    <td>User #{d.raisedByUserId}</td>
                                    <td>{d.raisedByRole}</td>
                                    <td>{d.reason}</td>
                                    <td><span className={`status-badge ${d.status === 'RESOLVED' ? 'status-valid' : 'status-rejected'}`}>{d.status}</span></td>
                                    <td>
                                        {d.status !== 'RESOLVED' && (
                                            <button className="btn btn-sm btn-primary" onClick={() => setSelectedDispute(d)}>Resolve</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedDispute && (
                <div className="overlay">
                    <div className="overlay-box">
                        <button className="overlay-close" onClick={() => setSelectedDispute(null)}>X</button>
                        <h3>Resolve Dispute #{selectedDispute.id}</h3>
                        <div style={{ margin: '1rem 0' }}>
                            <p><b>Reason:</b> {selectedDispute.reason}</p>
                            <p><b>Description:</b> {selectedDispute.description}</p>
                            <p><b>Date:</b> {selectedDispute.createdAt}</p>
                        </div>
                        <textarea
                            className="form-control"
                            placeholder="Enter resolution notes..."
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            rows="4"
                            style={{ width: '100%', marginBottom: '1rem' }}
                        />
                        <button className="btn btn-success" onClick={resolveDispute}>Confirm Resolution</button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
