import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderApi } from "../services/api";
import { useNotification } from "../context/NotificationContext";
import OrderForm from "../components/OrderForm";

const statusStyle = (s) => ({
  padding: "2px 10px", borderRadius: "99px", fontSize: "12px", fontWeight: 600,
  background: s === "confirmed" ? "#bbf7d0" : s === "cancelled" ? "#fca5a5" : "#fde68a",
  color: s === "confirmed" ? "#14532d" : s === "cancelled" ? "#7f1d1d" : "#78350f",
});

const btn = (extra = {}) => ({
  padding: "8px 16px", borderRadius: "8px", border: "none",
  fontSize: "13px", fontWeight: 600, cursor: "pointer", ...extra,
});

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { notify } = useNotification();

  async function load() {
    try {
      const res = await orderApi.getAll();
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCancel(id) {
    if (!window.confirm("Cancel this order? Stock will be restored.")) return;
    try {
      await orderApi.remove(id);
      notify("Order cancelled — stock restored");
      load();
    } catch {
      notify("Failed to cancel order", "error");
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700 }}>Orders</h2>
        <button style={btn({ background: "#3b82f6", color: "#fff" })} onClick={() => setShowForm(true)}>
          + New Order
        </button>
      </div>

      {loading ? <p style={{ color: "#64748b" }}>Loading…</p> : (
        <div style={{ background: "#fff", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <table>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                {["Order #", "Customer ID", "Total", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: "13px", color: "#475569", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>No orders yet</td></tr>
              ) : orders.map((o) => (
                <tr key={o.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <Link to={`/orders/${o.id}`} style={{ color: "#3b82f6", fontWeight: 600, textDecoration: "none" }}>
                      #{o.id}
                    </Link>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#64748b" }}>#{o.customer_id}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>${Number(o.total_amount).toFixed(2)}</td>
                  <td style={{ padding: "12px 16px" }}><span style={statusStyle(o.status)}>{o.status}</span></td>
                  <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px" }}>
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <button style={btn({ background: "#fef2f2", color: "#ef4444" })} onClick={() => handleCancel(o.id)}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <OrderForm onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />
      )}
    </div>
  );
}
