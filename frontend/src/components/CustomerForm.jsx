import { useState } from "react";
import { customerApi } from "../services/api";
import { useNotification } from "../context/NotificationContext";

const field = { display: "flex", flexDirection: "column", gap: "4px" };
const labelStyle = { fontSize: "13px", fontWeight: 600, color: "#475569" };
const inputStyle = { padding: "9px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", outline: "none" };

export default function CustomerForm({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { notify } = useNotification();

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await customerApi.create(form);
      notify("Customer created");
      onSaved();
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to create customer";
      notify(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 700 }}>Add Customer</h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { key: "name", label: "Full Name", type: "text" },
            { key: "email", label: "Email Address", type: "email" },
            { key: "phone", label: "Phone Number", type: "tel" },
          ].map(({ key, label, type }) => (
            <div key={key} style={field}>
              <label style={labelStyle}>{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setErrors((er) => ({ ...er, [key]: undefined })); }}
                style={{ ...inputStyle, borderColor: errors[key] ? "#ef4444" : "#e2e8f0" }}
              />
              {errors[key] && <span style={{ color: "#ef4444", fontSize: "12px" }}>{errors[key]}</span>}
            </div>
          ))}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
            <button type="button" onClick={onClose} style={{ padding: "9px 18px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "14px", fontWeight: 600 }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ padding: "9px 18px", borderRadius: "8px", border: "none", background: "#3b82f6", color: "#fff", fontSize: "14px", fontWeight: 600 }}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
