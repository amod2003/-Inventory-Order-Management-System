export default function StatCard({ label, value, color = "#3b82f6", icon }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        borderTop: `4px solid ${color}`,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "14px", color: "#64748b", fontWeight: 500 }}>{label}</span>
        {icon && <span style={{ fontSize: "22px" }}>{icon}</span>}
      </div>
      <span style={{ fontSize: "32px", fontWeight: 700, color: "#1e293b" }}>
        {value ?? "—"}
      </span>
    </div>
  );
}
