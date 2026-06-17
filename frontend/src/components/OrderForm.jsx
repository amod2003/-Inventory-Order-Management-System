import { useState, useEffect } from "react";
import { orderApi, customerApi, productApi } from "../services/api";
import { useNotification } from "../context/NotificationContext";

const inputStyle = { padding: "9px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none", width: "100%" };
const btn = (extra = {}) => ({ padding: "8px 14px", borderRadius: "8px", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer", ...extra });

export default function OrderForm({ onClose, onSaved }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [rows, setRows] = useState([{ product_id: "", quantity: 1 }]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { notify } = useNotification();

  useEffect(() => {
    Promise.all([customerApi.getAll(), productApi.getAll()]).then(([c, p]) => {
      setCustomers(c.data);
      setProducts(p.data);
      if (c.data.length) setCustomerId(c.data[0].id);
      if (p.data.length) setRows([{ product_id: p.data[0].id, quantity: 1 }]);
    });
  }, []);

  function addRow() {
    setRows((r) => [...r, { product_id: products[0]?.id || "", quantity: 1 }]);
  }

  function removeRow(i) {
    setRows((r) => r.filter((_, idx) => idx !== i));
  }

  function updateRow(i, key, val) {
    setRows((r) => r.map((row, idx) => idx === i ? { ...row, [key]: val } : row));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!customerId) { setError("Select a customer"); return; }
    if (!rows.length) { setError("Add at least one item"); return; }
    setSaving(true);
    try {
      await orderApi.create({
        customer_id: Number(customerId),
        items: rows.map((r) => ({ product_id: Number(r.product_id), quantity: Number(r.quantity) })),
      });
      notify("Order created");
      onSaved();
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to create order";
      setError(msg);
      notify(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" }}>
      <div style={{ background: "#fff", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "520px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 700 }}>Create Order</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#475569" }}>Customer</label>
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} style={inputStyle}>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
            </select>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#475569" }}>Items</label>
              <button type="button" style={btn({ background: "#eff6ff", color: "#3b82f6" })} onClick={addRow}>+ Add Item</button>
            </div>
            {rows.map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 36px", gap: "8px", marginBottom: "8px", alignItems: "center" }}>
                <select value={row.product_id} onChange={(e) => updateRow(i, "product_id", e.target.value)} style={inputStyle}>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name} (stock: {p.quantity})</option>)}
                </select>
                <input type="number" min="1" value={row.quantity} onChange={(e) => updateRow(i, "quantity", e.target.value)} style={inputStyle} />
                {rows.length > 1 && (
                  <button type="button" onClick={() => removeRow(i)} style={btn({ background: "#fef2f2", color: "#ef4444", padding: "8px" })}>×</button>
                )}
              </div>
            ))}
          </div>

          {error && <p style={{ color: "#ef4444", fontSize: "13px" }}>{error}</p>}

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={{ padding: "9px 18px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "14px", fontWeight: 600 }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ padding: "9px 18px", borderRadius: "8px", border: "none", background: "#3b82f6", color: "#fff", fontSize: "14px", fontWeight: 600 }}>
              {saving ? "Placing…" : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
