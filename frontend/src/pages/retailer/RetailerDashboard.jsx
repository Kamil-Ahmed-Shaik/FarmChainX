import DashboardLayout from "../../layouts/DashboardLayout";

export default function RetailerDashboard() {
  const status = localStorage.getItem("status"); // returns string
      
        return status === "false" ? (
          <DashboardLayout role="retailer" display={true}>
            <h2>Welcome retailer</h2>
            <p>Select an option from the sidebar.</p>
          </DashboardLayout>
        ) : (
          <DashboardLayout role="retailer" display={false}>
            <h2>Welcome retailer</h2>
            <p>You are blocked by admin</p>
          </DashboardLayout>
        );
}
