import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Traceability from "./pages/public/Traceability";

/* Admin */
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReports from "./pages/admin/AdminReports";
import AdminDisputes from "./pages/admin/AdminDisputes";
import AdminInbordings from "./pages/admin/AdminInbordings";
import AdminCrops from "./pages/admin/AdminCrops";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

/* Farmer */
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import FarmerProfile from "./pages/farmer/FarmerProfile";
import FarmerProducts from "./pages/farmer/FarmerProducts";
import FarmerCrops from "./pages/farmer/FarmerCrops";
import FarmerOrders from "./pages/farmer/FarmerOrders";
import FarmerMyOrders from "./pages/farmer/FarmerMyOrders";
import FarmerAnalytics from "./pages/farmer/FarmerAnalytics";


/* Distributor */
import DistributorDashboard from "./pages/distributor/DistributorDashboard";
import DistributorProfile from "./pages/distributor/DistributorProfile";
import DistributorCrops from "./pages/distributor/DistributorCrops";
import DistributorInventory from "./pages/distributor/DistributorInventory";
import DistributorOrders from "./pages/distributor/DistributorOrders";

/* Retailer */
import RetailerDashboard from "./pages/retailer/RetailerDashboard";
import RetailerProfile from "./pages/retailer/RetailerProfile";
import RetailerCrops from "./pages/retailer/RetailerCrops";
import RetailerProducts from "./pages/retailer/RetailerProducts";
import RetailerOrders from "./pages/retailer/RetailerOrders";
import RetailerStorage from "./pages/retailer/RetailerStorage";

/* Consumer */
import ConsumerDashboard from "./pages/consumer/ConsumerDashboard";
import ConsumerProfile from "./pages/consumer/ConsumerProfile";
import ConsumerProducts from "./pages/consumer/ConsumerProducts";
import ConsumerOrders from "./pages/consumer/ConsumerOrders";
import AIChatbot from "./components/ai/AIChatbot";

export default function App() {
  return (
    <BrowserRouter>
      <AIChatbot />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/traceability" element={<Traceability />} />

        {/* Farmer */}
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer/profile" element={<FarmerProfile />} />
        <Route path="/farmer/products" element={<FarmerProducts />} />
        <Route path="/farmer/crops" element={<FarmerCrops />} />
        <Route path="/farmer/orders" element={<FarmerOrders />} />
        <Route path="/farmer/my-orders" element={<FarmerMyOrders />} />
        <Route path="/farmer/analytics" element={<FarmerAnalytics />} />


        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/disputes" element={<AdminDisputes />} />
        <Route path="/admin/inbording" element={<AdminInbordings />} />
        <Route path="/admin/crops" element={<AdminCrops />} />
        <Route path="/admin/transactions" element={<AdminTransactions />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />

        {/* Distributor */}
        <Route path="/distributor/dashboard" element={<DistributorDashboard />} />
        <Route path="/distributor/profile" element={<DistributorProfile />} />
        <Route path="/distributor/products" element={<DistributorCrops />} />
        <Route path="/distributor/orders" element={<DistributorOrders />} />
        <Route path="/distributor/inventory" element={<DistributorInventory />} />

        {/* Retailer */}
        <Route path="/retailer/dashboard" element={<RetailerDashboard />} />
        <Route path="/retailer/profile" element={<RetailerProfile />} />
        <Route path="/retailer/products" element={<RetailerProducts />} />
        <Route path="/retailer/marketplace" element={<RetailerCrops />} />
        <Route path="/retailer/orders" element={<RetailerOrders />} />
        <Route path="/retailer/storage" element={<RetailerStorage />} />

        {/* Consumer */}
        <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
        <Route path="/consumer/profile" element={<ConsumerProfile />} />
        <Route path="/consumer/products" element={<ConsumerProducts />} />
        <Route path="/consumer/orders" element={<ConsumerOrders />} />

      </Routes>
    </BrowserRouter>
  );
}

