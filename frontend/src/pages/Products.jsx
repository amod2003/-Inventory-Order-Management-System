import { useEffect, useState } from "react";
import { productApi } from "../services/api";
import { useNotification } from "../context/NotificationContext";
import ProductForm from "../components/ProductForm";

const btn = (extra = {}) => ({
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  ...extra,
});

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const { notify } = useNotification();

  async function load() {
    try {
      const res = await productApi.getAll();
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await productApi.remove(id);
      notify(`"${name}" deleted`);
      load();
    } catch {
      notify("Failed to delete product", "error");
    }
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700 }}>Products</h2>
        <button
          style={btn({ background: "#3b82f6", color: "#fff" })}
          onClick={() => { setEditing(null); setShowForm(true); }}
        >
          + Add Product
        </button>
      </div>

      <input
        placeholder="Search by name or SKU…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #e2e8f0",
          fontSize: "14px",
          marginBottom: "20px",
          background: "#fff",
        }}
      />

      {loading ? (
        <p style={{ color: "#64748b" }}>Loading…</p>
      ) : (
        <div style={{ background: "#fff", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <table>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                {["Name", "SKU", "Price", "Stock", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: "13px", color: "#475569", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>No products found</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px" }}>{p.sku}</td>
                  <td style={{ padding: "12px 16px" }}>${Number(p.price).toFixed(2)}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "2px 8px", borderRadius: "99px", fontSize: "12px", fontWeight: 600,
                      background: p.quantity === 0 ? "#fca5a5" : p.quantity < 10 ? "#fde68a" : "#bbf7d0",
                      color: p.quantity === 0 ? "#7f1d1d" : p.quantity < 10 ? "#78350f" : "#14532d",
                    }}>
                      {p.quantity}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", display: "flex", gap: "8px" }}>
                    <button style={btn({ background: "#eff6ff", color: "#3b82f6" })} onClick={() => { setEditing(p); setShowForm(true); }}>Edit</button>
                    <button style={btn({ background: "#fef2f2", color: "#ef4444" })} onClick={() => handleDelete(p.id, p.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <ProductForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load(); }}
        />
      )}
    </div>
  );
}
