import { useEffect, useState } from "react";
import { customerApi } from "../services/api";
import { useNotification } from "../context/NotificationContext";
import CustomerForm from "../components/CustomerForm";

const btn = (extra = {}) => ({
  padding: "8px 16px", borderRadius: "8px", border: "none",
  fontSize: "13px", fontWeight: 600, cursor: "pointer", ...extra,
});

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { notify } = useNotification();

  async function load() {
    try {
      const res = await customerApi.getAll();
      setCustomers(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete customer "${name}"?`)) return;
    try {
      await customerApi.remove(id);
      notify(`"${name}" deleted`);
      load();
    } catch {
      notify("Failed to delete customer", "error");
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: 700 }}>Customers</h2>
        <button style={btn({ background: "#3b82f6", color: "#fff" })} onClick={() => setShowForm(true)}>
          + Add Customer
        </button>
      </div>

      {loading ? <p style={{ color: "#64748b" }}>Loading…</p> : (
        <div style={{ background: "#fff", borderRadius: "10px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <table>
            <thead>
              <tr style={{ background: "#f1f5f9" }}>
                {["Name", "Email", "Phone", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", fontSize: "13px", color: "#475569", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: "24px", textAlign: "center", color: "#94a3b8" }}>No customers yet</td></tr>
              ) : customers.map((c) => (
                <tr key={c.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px" }}>{c.email}</td>
                  <td style={{ padding: "12px 16px", color: "#64748b", fontSize: "13px" }}>{c.phone}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <button style={btn({ background: "#fef2f2", color: "#ef4444" })} onClick={() => handleDelete(c.id, c.name)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <CustomerForm onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load(); }} />
      )}
    </div>
  );
}
