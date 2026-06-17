import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.username || !form.email || !form.password || !form.confirm) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("inv_user", JSON.stringify({ email: form.email, username: form.username }));
      navigate("/dashboard");
    }, 900);
  }

  const inputStyle = {
    width: "100%", padding: "13px 16px 13px 44px", border: "1.5px solid #e2e8f0",
    borderRadius: "12px", fontSize: "14px", color: "#1e293b", background: "#f8fafc",
    outline: "none", boxSizing: "border-box", fontFamily: "Inter, system-ui, sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Inter, system-ui, sans-serif", padding: "20px",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: "10%", right: "8%", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", left: "8%", width: "240px", height: "240px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{
        width: "100%", maxWidth: "440px",
        background: "rgba(255,255,255,0.97)",
        borderRadius: "24px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        overflow: "hidden",
        animation: "loginFadeUp 0.5s ease",
        position: "relative", zIndex: 10,
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "32px 36px 24px", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(99,102,241,0.2)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "11px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(99,102,241,0.5)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#f1f5f9" }}>Inventory</div>
              <div style={{ fontSize: "10px", color: "#6366f1", fontWeight: 600, letterSpacing: "0.06em" }}>MANAGEMENT</div>
            </div>
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 4px", position: "relative", zIndex: 1 }}>Create your account</h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0, position: "relative", zIndex: 1 }}>Free forever. No credit card required.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px 36px 32px" }}>
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px", padding: "11px 14px", marginBottom: "14px", fontSize: "13px", color: "#dc2626", display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {[
            { field: "username", label: "Username", placeholder: "yourname", type: "text", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
            { field: "email", label: "Email address", placeholder: "you@company.com", type: "email", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
            { field: "password", label: "Password", placeholder: "Min. 4 characters", type: "password", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
            { field: "confirm", label: "Confirm password", placeholder: "Repeat your password", type: "password", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
          ].map(({ field, label, placeholder, type, icon }) => (
            <div key={field} style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>{label}</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }}>{icon}</div>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={set(field)}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "#6366f1"; e.target.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.12)"; e.target.style.background = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fafc"; }}
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "14px", border: "none", borderRadius: "12px",
              fontSize: "15px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
              boxShadow: "0 4px 20px rgba(99,102,241,0.4)", marginTop: "6px",
              opacity: loading ? 0.75 : 1, fontFamily: "Inter, system-ui, sans-serif",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                Creating account…
              </span>
            ) : "Create Account →"}
          </button>

          <p style={{ textAlign: "center", marginTop: "18px", fontSize: "13px", color: "#64748b" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
