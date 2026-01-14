import DashboardLayout from "../../layouts/DashboardLayout";

export default function AdminReports() {
  const status = localStorage.getItem("status"); // returns string
  
    return status === "false" ? (
      <DashboardLayout role="admin" display={true}>
        <h2>Reports</h2>
        <p>Coming soon...</p>
      </DashboardLayout>
    ) : (
      <DashboardLayout role="admin" display={false}>
        <h2>Welcome Admin</h2>
        <p>You are blocked by admin</p>
      </DashboardLayout>
    );
}
