import { NavLink } from "react-router-dom";
import { useEffect, useRef } from "react";

const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  {
    to: "/products",
    label: "Products",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #f093fb, #f5576c)",
  },
  {
    to: "/customers",
    label: "Customers",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
  },
  {
    to: "/orders",
    label: "Orders",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #43e97b, #38f9d7)",
  },
];

const style = document.createElement("style");
style.textContent = `
  @keyframes iconPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.15); }
  }
  @keyframes iconBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
  }
  @keyframes logoSpin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  .nav-icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    flex-shrink: 0;
    transition: transform 0.2s;
  }
  .nav-link-item:hover .nav-icon-wrap {
    animation: iconBounce 0.5s ease infinite;
  }
  .nav-link-item.active .nav-icon-wrap {
    animation: iconPulse 2s ease-in-out infinite;
  }
`;
if (!document.head.querySelector("[data-layout-styles]")) {
  style.setAttribute("data-layout-styles", "true");
  document.head.appendChild(style);
}

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, system-ui, sans-serif" }}>
      <aside
        style={{
          width: "240px",
          background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          color: "#e2e8f0",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "28px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
            <div style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.2 }}>Inventory</div>
              <div style={{ fontSize: "11px", color: "#6366f1", fontWeight: 600, letterSpacing: "0.05em" }}>MANAGEMENT</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          <p style={{ fontSize: "10px", fontWeight: 700, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0 8px", marginBottom: "8px" }}>
            Main Menu
          </p>
          {navItems.map(({ to, label, icon, gradient }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-link-item${isActive ? " active" : ""}`}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px",
                borderRadius: "12px",
                color: isActive ? "#f1f5f9" : "#94a3b8",
                background: isActive ? "rgba(99,102,241,0.15)" : "transparent",
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 400,
                marginBottom: "4px",
                border: isActive ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                transition: "all 0.2s",
              })}
            >
              <div
                className="nav-icon-wrap"
                style={{ background: gradient, boxShadow: `0 4px 12px rgba(0,0,0,0.25)` }}
              >
                {icon}
              </div>
              <span>{label}</span>
              <div style={{ marginLeft: "auto", opacity: 0.4, fontSize: "12px" }}>›</div>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 700, color: "white",
          }}>A</div>
          <div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#e2e8f0" }}>Admin</div>
            <div style={{ fontSize: "10px", color: "#64748b" }}>v1.0.0</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, background: "#f1f5f9", overflowY: "auto" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 28px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
