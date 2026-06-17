import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { orderApi } from "../services/api";
import { useNotification } from "../context/NotificationContext";

const statusStyle = (s) => ({
  padding: "3px 12px", borderRadius: "99px", fontSize: "13px", fontWeight: 600,
  background: s === "confirmed" ? "#bbf7d0" : s === "cancelled" ? "#fca5a5" : "#fde68a",
  color: s === "confirmed" ? "#14532d" : s === "cancelled" ? "#7f1d1d" : "#78350f",
});

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { notify } = useNotification();

  useEffect(() => {
    orderApi.getById(id)
      .then((res) => setOrder(res.data))
      .catch(() => notify("Order not found", "error"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleCancel() {
    if (!window.confirm("Cancel this order? Stock will be restored.")) return;
    try {
      await orderApi.remove(id);
      notify("Order cancelled — stock restored");
      navigate("/orders");
    } catch {
      notify("Failed to cancel order", "error");
    }
  }

  if (loading) return <p style={{ color: "#64748b" }}>Loading…</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <Link to="/orders" style={{ color: "#3b82f6", fontSize: "14px", textDecoration: "none" }}>← Back to Orders</Link>
        <h2 style={{ fontSize: "22px", fontWeight: 700 }}>Order #{order.id}</h2>
        <span style={statusStyle(order.status)}>{order.status}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {[
          { label: "Customer ID", value: `#${order.customer_id}` },
          { label: "Order Date", value: new Date(order.created_at).toLocaleString() },
          { label: "Total Amount", value: `$${Number(order.total_amount).toFixed(2)}` },
          { label: "Items", value: `${order.items.length} item(s)` },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: "#fff", borderRadius: "10px", padding: "18px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>{label}</p>
            <p style={{ fontSize: "18px", fontWeight: 700 }}>{value}</p>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Order Items</h3>
      <div style={{ background: "#fff", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflow: "hidden", marginBottom: "24px" }}>
        <table>
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              {["Product ID", "Unit Price", "Qty", "Subtotal"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", fontSize: "13px", color: "#475569", fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px 16px" }}>#{item.product_id}</td>
                <td style={{ padding: "12px 16px" }}>${Number(item.unit_price).toFixed(2)}</td>
                <td style={{ padding: "12px 16px" }}>{item.quantity}</td>
                <td style={{ padding: "12px 16px", fontWeight: 600 }}>${(Number(item.unit_price) * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleCancel}
        style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#ef4444", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
      >
        Cancel Order
      </button>
    </div>
  );
}
