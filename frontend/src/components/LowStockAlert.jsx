import { Link } from "react-router-dom";

export default function LowStockAlert({ items }) {
  if (!items.length) {
    return (
      <div
        style={{
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "10px",
          padding: "16px 20px",
          color: "#15803d",
          fontSize: "14px",
        }}
      >
        All products have sufficient stock.
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px", color: "#1e293b" }}>
        Low Stock Alerts
      </h3>
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <table>
          <thead>
            <tr style={{ background: "#fef2f2" }}>
              <th style={{ padding: "10px 16px", fontSize: "13px", color: "#991b1b", fontWeight: 600 }}>Product</th>
              <th style={{ padding: "10px 16px", fontSize: "13px", color: "#991b1b", fontWeight: 600 }}>SKU</th>
              <th style={{ padding: "10px 16px", fontSize: "13px", color: "#991b1b", fontWeight: 600 }}>Qty</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderTop: "1px solid #fee2e2" }}>
                <td style={{ padding: "10px 16px", fontSize: "14px" }}>
                  <Link to="/products" style={{ color: "#3b82f6", textDecoration: "none", fontWeight: 500 }}>
                    {item.name}
                  </Link>
                </td>
                <td style={{ padding: "10px 16px", fontSize: "13px", color: "#64748b" }}>{item.sku}</td>
                <td style={{ padding: "10px 16px" }}>
                  <span
                    style={{
                      background: item.quantity === 0 ? "#fca5a5" : "#fde68a",
                      color: item.quantity === 0 ? "#7f1d1d" : "#78350f",
                      padding: "2px 8px",
                      borderRadius: "99px",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {item.quantity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
