import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import LowStockAlert from "../components/LowStockAlert";
import { productApi, customerApi, orderApi } from "../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0 });
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [p, c, o] = await Promise.all([
          productApi.getAll(),
          customerApi.getAll(),
          orderApi.getAll(),
        ]);
        setStats({
          products: p.data.length,
          customers: c.data.length,
          orders: o.data.length,
        });
        setLowStock(p.data.filter((prod) => prod.quantity < 10));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p style={{ color: "#64748b" }}>Loading dashboard…</p>;

  return (
    <div>
      <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "24px", color: "#1e293b" }}>
        Dashboard
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        <StatCard label="Total Products" value={stats.products} color="#3b82f6" icon="📦" />
        <StatCard label="Total Customers" value={stats.customers} color="#22c55e" icon="👥" />
        <StatCard label="Total Orders" value={stats.orders} color="#f59e0b" icon="🛒" />
        <StatCard label="Low Stock Items" value={lowStock.length} color="#ef4444" icon="⚠️" />
      </div>

      <LowStockAlert items={lowStock} />
    </div>
  );
}
