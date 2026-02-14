// DashboardLayout.jsx
import { NavLink } from "react-router-dom";
import { roleLinks } from "../config/roleLinks";
import "../styles/Dashboard.css";

export default function DashboardLayout({ role, children, display }) {
  const links = roleLinks[role] || [];
  const isBlocked = localStorage.getItem("status") === "true";
  const farmerApprovalStatus = localStorage.getItem("approvalStatus"); // PENDING, APPROVED, REJECTED

  // Check if user should be restricted (blocked or pending approval)
  const isBlockedUser = isBlocked;
  const isPendingFarmer = role === "farmer" && farmerApprovalStatus === "PENDING";

  const currentPath = window.location.pathname;
  const isProfilePage = currentPath.includes("/profile");

  // Blocked users cannot access anything
  // Pending farmers can only access profile
  const shouldShowRestrictedMessage = isBlockedUser || (isPendingFarmer && !isProfilePage);

  return (
    <div className="dashboard">
      <aside>
        <h3>{role.toUpperCase()} DASHBOARD</h3>

        {(isBlockedUser || isPendingFarmer) && (
          <div className="restriction-notice">
            <span className="restriction-icon">⚠️</span>
            <span>{isBlockedUser ? "Account Blocked" : "Pending Approval"}</span>
          </div>
        )}

        {/* Sidebar Navigation Links with strict access control */}
        {links.map((link) => {
          // Blocked users see NO links at all
          if (isBlockedUser) return null;

          // Pending farmers see all links but only Profile is clickable
          if (isPendingFarmer && link.label !== "Profile") {
            return (
              <span key={link.path} className="disabled-link" style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                {link.label}
              </span>
            );
          }

          // All other cases: show clickable link
          return (
            <NavLink key={link.path} to={link.path}>
              {link.label}
            </NavLink>
          );
        })}

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </aside>

      <main>
        {shouldShowRestrictedMessage ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-3xl font-bold text-red-600 mb-4">
              {isBlockedUser ? "Access Blocked" : "Access Restricted"}
            </h2>
            <p className="text-gray-600 max-w-md">
              {isBlockedUser
                ? "Your account has been blocked by the administrator. All features are disabled. Please contact support."
                : "Your farmer account is pending approval. You can only access your profile until an administrator verifies your account."}
            </p>
            {isPendingFarmer && (
              <NavLink
                to={`/${role}/profile`}
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem 1.5rem",
                  background: "#059669",
                  color: "white",
                  borderRadius: "0.5rem",
                  textDecoration: "none",
                  fontWeight: "600"
                }}
              >
                Go to Profile
              </NavLink>
            )}
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}
