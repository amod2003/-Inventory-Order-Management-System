import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const styleTag = document.createElement("style");
styleTag.textContent = `
  @keyframes loginFadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes loginFloat {
    0%, 100% { transform: translateY(0px) rotate(-3deg); }
    50%       { transform: translateY(-10px) rotate(-3deg); }
  }
  @keyframes loginFloatAlt {
    0%, 100% { transform: translateY(0px) rotate(6deg); }
    50%       { transform: translateY(-8px) rotate(6deg); }
  }
  @keyframes loginPulse {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50%       { opacity: 1; transform: scale(1.05); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .login-input {
    width: 100%;
    padding: 13px 16px 13px 44px;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    font-size: 14px;
    color: #1e293b;
    background: #f8fafc;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    box-sizing: border-box;
    font-family: Inter, system-ui, sans-serif;
  }
  .login-input:focus {
    border-color: #6366f1;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
  }
  .login-btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: #fff;
    letter-spacing: 0.02em;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(99,102,241,0.4);
    font-family: Inter, system-ui, sans-serif;
  }
  .login-btn:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(99,102,241,0.45);
  }
  .login-btn:active:not(:disabled) {
    transform: translateY(0);
  }
  .login-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;
if (!document.head.querySelector("[data-login-styles]")) {
  styleTag.setAttribute("data-login-styles", "true");
  document.head.appendChild(styleTag);
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const [showPass, setShowPass] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    setLoading(true);
    // Simulate auth delay for demo
    setTimeout(() => {
      localStorage.setItem("inv_user", JSON.stringify({ email, username: email.split("@")[0] }));
      navigate("/dashboard");
    }, 900);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, system-ui, sans-serif",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background decorative blobs */}
      <div style={{ position: "absolute", top: "10%", left: "8%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", right: "10%", width: "250px", height: "250px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Floating feature cards */}
      <div className="loginFloat" style={{
        position: "absolute", top: "18%", left: "6%",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px", padding: "16px 20px",
        animation: "loginFloat 4s ease-in-out infinite",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg,#f093fb,#f5576c)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#f1f5f9" }}>Products</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>Manage inventory</div>
        </div>
      </div>

      <div style={{
        position: "absolute", bottom: "22%", right: "6%",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px", padding: "16px 20px",
        animation: "loginFloatAlt 5s ease-in-out infinite",
        display: "flex", alignItems: "center", gap: "12px",
      }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg,#43e97b,#38f9d7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#f1f5f9" }}>Orders</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>Track & fulfil</div>
        </div>
      </div>

      {/* Login card */}
      <div style={{
        width: "100%", maxWidth: "420px",
        background: "rgba(255,255,255,0.97)",
        borderRadius: "24px",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        overflow: "hidden",
        animation: "loginFadeUp 0.5s ease",
        position: "relative",
        zIndex: 10,
      }}>
        {/* Card header gradient */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: "36px 36px 28px",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "-30px", right: "-30px", width: "130px", height: "130px", borderRadius: "50%", background: "rgba(99,102,241,0.2)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-20px", left: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(139,92,246,0.15)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(99,102,241,0.5)",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "#f1f5f9" }}>Inventory</div>
                <div style={{ fontSize: "11px", color: "#6366f1", fontWeight: 600, letterSpacing: "0.06em" }}>MANAGEMENT</div>
              </div>
            </div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>Welcome Back!</h1>
            <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Sign in to your workspace</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "28px 36px 36px" }}>
          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: "10px", padding: "12px 14px",
              marginBottom: "16px", fontSize: "13px", color: "#dc2626",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Email field */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>
              Email address
            </label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <input
                className="login-input"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password field */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Password</label>
              <span style={{ fontSize: "12px", color: "#6366f1", cursor: "pointer", fontWeight: 500 }}>Forgot password?</span>
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94a3b8" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <input
                className="login-input"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                style={{ paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, display: "flex" }}
              >
                {showPass ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <input type="checkbox" id="remember" style={{ accentColor: "#6366f1", width: "15px", height: "15px", cursor: "pointer" }} />
            <label htmlFor="remember" style={{ fontSize: "13px", color: "#64748b", cursor: "pointer" }}>Keep me signed in</label>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <span style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                Signing in…
              </span>
            ) : "Sign In →"}
          </button>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#64748b" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>
              Create one free
            </Link>
          </p>

          {/* Demo credentials */}
          <div style={{
            marginTop: "20px",
            padding: "14px 16px",
            background: "#f8fafc",
            border: "1px dashed #cbd5e1",
            borderRadius: "12px",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 10px" }}>
              Demo Accounts
            </p>
            {[
              { label: "Admin", email: "admin@inventory.com", password: "admin123" },
            ].map(({ label, email: demoEmail, password: demoPass }) => (
              <button
                key={label}
                type="button"
                onClick={() => { setEmail(demoEmail); setPassword(demoPass); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "8px 10px", borderRadius: "8px", border: "1px solid #e2e8f0",
                  background: "#fff", cursor: "pointer", marginBottom: "6px",
                  transition: "border-color 0.15s, background 0.15s",
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.background = "#f5f3ff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ width: "24px", height: "24px", borderRadius: "6px", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: "white" }}>
                    {label[0]}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>{label}</span>
                </span>
                <span style={{ fontSize: "11px", color: "#64748b", fontFamily: "monospace" }}>
                  {demoEmail} / {demoPass}
                </span>
              </button>
            ))}
            <p style={{ fontSize: "11px", color: "#94a3b8", margin: "6px 0 0", textAlign: "center" }}>
              Click any row to auto-fill credentials
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
