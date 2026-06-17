import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/products", label: "Products", icon: "📦" },
  { to: "/customers", label: "Customers", icon: "👥" },
  { to: "/orders", label: "Orders", icon: "🛒" },
];

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
      <aside
        style={{
          width: "220px",
          background: "#1e293b",
          color: "#e2e8f0",
          display: "flex",
          flexDirection: "column",
          padding: "0",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "24px 20px", borderBottom: "1px solid #334155" }}>
          <h1 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#f8fafc", lineHeight: 1.4 }}>
            Inventory & Order
          </h1>
          <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#94a3b8" }}>Management System</p>
        </div>
        <nav style={{ flex: 1, padding: "12px 0" }}>
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 20px",
                color: isActive ? "#f8fafc" : "#94a3b8",
                background: isActive ? "#334155" : "transparent",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                borderLeft: isActive ? "3px solid #3b82f6" : "3px solid transparent",
                transition: "all 0.15s",
              })}
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid #334155", fontSize: "12px", color: "#64748b" }}>
          v1.0.0
        </div>
      </aside>
      <main style={{ flex: 1, background: "#f8fafc", overflowY: "auto" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
