import { useState } from "react";
import { productApi } from "../services/api";
import { useNotification } from "../context/NotificationContext";

const field = { display: "flex", flexDirection: "column", gap: "4px" };
const label = { fontSize: "13px", fontWeight: 600, color: "#475569" };
const input = {
  padding: "9px 12px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  fontSize: "14px",
  outline: "none",
};

export default function ProductForm({ initial, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    sku: initial?.sku || "",
    price: initial?.price || "",
    quantity: initial?.quantity ?? "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { notify } = useNotification();

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.sku.trim()) e.sku = "SKU is required";
    if (!form.price || Number(form.price) <= 0) e.price = "Price must be > 0";
    if (form.quantity === "" || Number(form.quantity) < 0) e.quantity = "Quantity must be ≥ 0";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), quantity: Number(form.quantity) };
      if (initial) {
        await productApi.update(initial.id, { name: payload.name, price: payload.price, quantity: payload.quantity });
        notify("Product updated");
      } else {
        await productApi.create(payload);
        notify("Product created");
      }
      onSaved();
    } catch (err) {
      const msg = err?.response?.data?.detail || "Failed to save product";
      notify(msg, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ background: "#fff", borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: 700 }}>
          {initial ? "Edit Product" : "Add Product"}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            { key: "name", label: "Product Name", type: "text", disabled: false },
            { key: "sku", label: "SKU / Code", type: "text", disabled: !!initial },
            { key: "price", label: "Price (₹)", type: "number", disabled: false },
            { key: "quantity", label: "Quantity in Stock", type: "number", disabled: false },
          ].map(({ key, label: lbl, type, disabled }) => (
            <div key={key} style={field}>
              <label style={label}>{lbl}</label>
              <input
                type={type}
                value={form[key]}
                disabled={disabled}
                onChange={(e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setErrors((er) => ({ ...er, [key]: undefined })); }}
                style={{ ...input, background: disabled ? "#f8fafc" : "#fff", borderColor: errors[key] ? "#ef4444" : "#e2e8f0" }}
                min={type === "number" ? 0 : undefined}
                step={key === "price" ? "0.01" : "1"}
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
