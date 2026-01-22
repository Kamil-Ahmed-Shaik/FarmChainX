import DashboardLayout from "../../layouts/DashboardLayout";

export default function FarmerDashboard() {
  const status = localStorage.getItem("status"); // returns string
    
      return status === "false" ? (
        <DashboardLayout role="farmer" display={true}>
          <h2>Welcome farmer</h2>
          <p>Select an option from the sidebar.</p>
        </DashboardLayout>
      ) : (
        <DashboardLayout role="farmer" display={false}>
          <h2>Welcome farmer</h2>
          <p>You are blocked by admin</p>
        </DashboardLayout>
      );
}
