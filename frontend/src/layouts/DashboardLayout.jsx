// DashboardLayout.jsx
import { NavLink } from "react-router-dom";
import { roleLinks } from "../config/roleLinks";

export default function DashboardLayout({ role, children, display }) {
  const links = roleLinks[role] || [];

  return (
    <div className="dashboard">
      <aside>
        <h3>{role.toUpperCase()} DASHBOARD</h3>

        {display === true ? (
          links.map((link) => (
            <NavLink key={link.path} to={link.path}>
              {link.label}
            </NavLink>
          ))
        ) : (
          links.map((link, index) => (
            <NavLink key={index} to="">
              {link.label}
            </NavLink>
          ))
        )}

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </aside>

      <main>{children}</main>
    </div>
  );
}