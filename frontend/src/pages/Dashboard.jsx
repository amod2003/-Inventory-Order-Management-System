import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { productApi, customerApi, orderApi } from "../services/api";

// Inject keyframes once
const styleTag = document.createElement("style");
styleTag.textContent = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: scale(0.5); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
    70%  { box-shadow: 0 0 0 10px rgba(99,102,241,0); }
    100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .stat-card {
    animation: fadeUp 0.5s ease both;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
  }
  .icon-float { animation: float 3s ease-in-out infinite; }
  .pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
`;
if (!document.head.querySelector("[data-dash-styles]")) {
  styleTag.setAttribute("data-dash-styles", "true");
  document.head.appendChild(styleTag);
}

const cards = [
  {
    label: "Total Products",
    key: "products",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    shadow: "rgba(102,126,234,0.35)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    link: "/products",
    delay: "0s",
  },
  {
    label: "Total Customers",
    key: "customers",
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    shadow: "rgba(240,147,251,0.35)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    link: "/customers",
    delay: "0.1s",
  },
  {
    label: "Total Orders",
    key: "orders",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    shadow: "rgba(79,172,254,0.35)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    link: "/orders",
    delay: "0.2s",
  },
  {
    label: "Low Stock Alerts",
    key: "lowStock",
    gradient: "linear-gradient(135deg, #f9ca24 0%, #f0932b 100%)",
    shadow: "rgba(249,202,36,0.35)",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    link: "/products",
    delay: "0.3s",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0, lowStock: 0 });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, c, o] = await Promise.all([
          productApi.getAll(),
          customerApi.getAll(),
          orderApi.getAll(),
        ]);
        const low = p.data.filter((prod) => prod.quantity < 10);
        setStats({
          products: p.data.length,
          customers: c.data.length,
          orders: o.data.length,
          lowStock: low.length,
        });
        setLowStockItems(low);
        setRecentOrders(o.data.slice(0, 5));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 17 ? "Good Afternoon" : "Good Evening";

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", flexDirection: "column", gap: "16px" }}>
        <div style={{ width: "48px", height: "48px", border: "4px solid #e2e8f0", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin-slow 0.8s linear infinite" }} />
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header banner */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
        borderRadius: "20px",
        padding: "32px 36px",
        marginBottom: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        position: "relative",
        animation: "fadeUp 0.4s ease",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-40px", right: "80px", width: "180px", height: "180px", borderRadius: "50%", background: "rgba(99,102,241,0.12)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "20px", right: "20px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(139,92,246,0.15)", pointerEvents: "none" }} />

        <div style={{ zIndex: 1 }}>
          <p style={{ fontSize: "13px", color: "#6366f1", fontWeight: 600, marginBottom: "4px", letterSpacing: "0.05em" }}>
            {greeting}, Admin 👋
          </p>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#f1f5f9", margin: "0 0 8px" }}>
            Welcome Back!
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
            {now.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <div className="icon-float" style={{ zIndex: 1 }}>
          <div style={{
            width: "80px", height: "80px", borderRadius: "20px",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 30px rgba(99,102,241,0.5)",
          }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        marginBottom: "32px",
      }}>
        {cards.map(({ label, key, gradient, shadow, icon, link, delay }) => (
          <Link key={key} to={link} style={{ textDecoration: "none" }}>
            <div
              className="stat-card"
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: `0 4px 20px rgba(0,0,0,0.06)`,
                animationDelay: delay,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Background gradient blob */}
              <div style={{
                position: "absolute", top: "-20px", right: "-20px",
                width: "100px", height: "100px", borderRadius: "50%",
                background: gradient, opacity: 0.08,
                pointerEvents: "none",
              }} />

              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                <div
                  className="pulse-ring"
                  style={{
                    width: "52px", height: "52px", borderRadius: "14px",
                    background: gradient,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 8px 20px ${shadow}`,
                  }}
                >
                  {icon}
                </div>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#22c55e", background: "#f0fdf4", padding: "3px 8px", borderRadius: "99px" }}>
                  Live
                </span>
              </div>

              <div style={{ fontSize: "36px", fontWeight: 800, color: "#0f172a", lineHeight: 1, marginBottom: "6px", animation: "countUp 0.6s ease both", animationDelay: delay }}>
                {stats[key]}
              </div>
              <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>{label}</div>

              <div style={{ marginTop: "16px", height: "3px", borderRadius: "99px", background: "#f1f5f9", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: stats[key] > 0 ? "70%" : "0%",
                  background: gradient,
                  borderRadius: "99px",
                  transition: "width 1s ease",
                }} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Recent Orders */}
        <div style={{
          background: "#fff", borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          overflow: "hidden",
          animation: "fadeUp 0.5s ease 0.4s both",
        }}>
          <div style={{ padding: "20px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Recent Orders</h3>
            <Link to="/orders" style={{ fontSize: "12px", color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>View All →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>No orders yet</div>
          ) : (
            recentOrders.map((o) => (
              <div key={o.id} style={{ padding: "14px 24px", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #4facfe, #00f2fe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "white" }}>
                    #{o.id}
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>Customer #{o.customer_id}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>{new Date(o.created_at).toLocaleDateString("en-IN")}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>₹{Number(o.total_amount).toFixed(2)}</div>
                  <span style={{
                    fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "99px",
                    background: o.status === "confirmed" ? "#f0fdf4" : "#fef2f2",
                    color: o.status === "confirmed" ? "#16a34a" : "#dc2626",
                  }}>
                    {o.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Low Stock */}
        <div style={{
          background: "#fff", borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          overflow: "hidden",
          animation: "fadeUp 0.5s ease 0.5s both",
        }}>
          <div style={{ padding: "20px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0f172a", margin: 0 }}>Low Stock Alerts</h3>
            <Link to="/products" style={{ fontSize: "12px", color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>Manage →</Link>
          </div>
          {lowStockItems.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>✅</div>
              <div style={{ fontSize: "14px", color: "#22c55e", fontWeight: 600 }}>All products well stocked</div>
            </div>
          ) : (
            lowStockItems.slice(0, 5).map((item) => (
              <div key={item.id} style={{ padding: "14px 24px", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #f9ca24, #f0932b)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#1e293b" }}>{item.name}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8" }}>SKU: {item.sku}</div>
                  </div>
                </div>
                <span style={{
                  padding: "4px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: 700,
                  background: item.quantity === 0 ? "#fef2f2" : "#fefce8",
                  color: item.quantity === 0 ? "#dc2626" : "#ca8a04",
                }}>
                  {item.quantity === 0 ? "Out of stock" : `${item.quantity} left`}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
