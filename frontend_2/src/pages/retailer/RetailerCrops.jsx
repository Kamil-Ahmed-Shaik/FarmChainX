import DashboardLayout from "../../layouts/DashboardLayout";
import "../../styles/Components.css";

export default function RetailerCrops() {
  const status = localStorage.getItem("status");

  return status === "false" ? (
    <DashboardLayout role="retailer" display={true}>
      <header className="dashboard-header">
        <h2 className="dashboard-title">Retailer Marketplace</h2>
      </header>

      <div className="dashboard-card">
        <h3>Coming Soon</h3>
        <p>The retailer marketplace is currently under development. Check back soon to browse and purchase crops directly from distributors.</p>
      </div>
    </DashboardLayout>
  ) : (
    <DashboardLayout role="retailer" display={false}>
      <h2>Blocked</h2>
      <p>You are blocked by admin</p>
    </DashboardLayout>
  );
}
