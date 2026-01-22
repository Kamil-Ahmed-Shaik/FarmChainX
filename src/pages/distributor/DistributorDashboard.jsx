import DashboardLayout from "../../layouts/DashboardLayout";

export default function DistributorDashboard() {
  const status = localStorage.getItem("status"); // returns string
  
    return status === "false" ? (
      <DashboardLayout role="distributor" display={true}>
        <h2>Welcome distributor</h2>
        <p>Select an option from the sidebar.</p>
      </DashboardLayout>
    ) : (
      <DashboardLayout role="distributor" display={false}>
        <h2>Welcome distributor</h2>
        <p>You are blocked by admin</p>
      </DashboardLayout>
    );
}
