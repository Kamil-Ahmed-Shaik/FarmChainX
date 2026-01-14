import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

/* Farmer */
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import FarmerProfile from "./pages/farmer/FarmerProfile";
import FarmerProducts from "./pages/farmer/FarmerProducts";
import FarmerOrders from "./pages/farmer/FarmerOrders";

/* Admin */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import AdminInbordings from "./pages/admin/AdminInbordings";


/* Distributor */
import DistributorDashboard from "./pages/distributor/DistributorDashboard";
import DistributorProfile from "./pages/distributor/DistributorProfile";

/* Retailer */
import RetailerDashboard from "./pages/retailer/RetailerDashboard";
import RetailerProfile from "./pages/retailer/RetailerProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Farmer */}
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/profile" element={<FarmerProfile />} />
        <Route path="/farmer/products" element={<FarmerProducts />} />
        <Route path="/farmer/orders" element={<FarmerOrders />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/inbording" element={<AdminInbordings />} />

        {/* Distributor */}
        <Route path="/distributor/dashboard" element={<DistributorDashboard />} />
        <Route path="/distributor/profile" element={<DistributorProfile />} />

        {/* Retailer */}
        <Route path="/retailer/dashboard" element={<RetailerDashboard />} />
        <Route path="/retailer/profile" element={<RetailerProfile />} />
      </Routes>
    </BrowserRouter>
  );
}
