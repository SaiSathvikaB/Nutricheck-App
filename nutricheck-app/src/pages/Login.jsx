import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../services/supabaseClient"
import bcrypt from "bcryptjs"

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState("")

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single()

    if (error) {
      setError("User not found")
      setLoading(false)
      return
    }

    const valid = await bcrypt.compare(password, data.password)
    if (!valid) {
      setError("Incorrect password")
      setLoading(false)
      return
    }

    setLoading(false)
    navigate("/dashboard")
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #0a2e2a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet" />

      {/* Animated background orbs */}
      <div style={{
        position: "absolute", top: "-10%", left: "-5%",
        width: "500px", height: "500px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,210,150,0.12) 0%, transparent 70%)",
        animation: "float1 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "-15%", right: "-5%",
        width: "600px", height: "600px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,120,255,0.1) 0%, transparent 70%)",
        animation: "float2 10s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "40%", right: "15%",
        width: "300px", height: "300px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,210,150,0.07) 0%, transparent 70%)",
        animation: "float1 12s ease-in-out infinite 2s",
      }} />

      {/* Grid pattern overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(0,210,150,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,150,0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      {/* Floating health icons */}
      {[
        { icon: "♥", top: "15%", left: "8%", size: "24px", delay: "0s", opacity: 0.15 },
        { icon: "⚕", top: "70%", left: "6%", size: "28px", delay: "1.5s", opacity: 0.12 },
        { icon: "✚", top: "25%", right: "8%", size: "20px", delay: "0.8s", opacity: 0.15 },
        { icon: "◎", top: "60%", right: "10%", size: "32px", delay: "2s", opacity: 0.1 },
        { icon: "♥", bottom: "20%", left: "12%", size: "18px", delay: "3s", opacity: 0.1 },
        { icon: "✚", bottom: "30%", right: "7%", size: "22px", delay: "1s", opacity: 0.12 },
      ].map((item, i) => (
        <div key={i} style={{
          position: "absolute", top: item.top, left: item.left, right: item.right, bottom: item.bottom,
          fontSize: item.size, color: "#00d296", opacity: item.opacity,
          animation: `float1 ${6 + i}s ease-in-out infinite ${item.delay}`,
        }}>{item.icon}</div>
      ))}

      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-20px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(20px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      {/* Main container */}
      <div style={{
        display: "flex",
        width: "900px",
        maxWidth: "95vw",
        minHeight: "540px",
        borderRadius: "28px",
        overflow: "hidden",
        boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,210,150,0.1)",
        animation: "fadeUp 0.7s ease-out",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Left panel */}
        <div style={{
          flex: "1",
          background: "linear-gradient(160deg, rgba(0,210,150,0.15) 0%, rgba(0,60,40,0.4) 100%)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(0,210,150,0.12)",
          padding: "52px 44px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
          <div>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "52px" }}>
              <div style={{
                width: "42px", height: "42px", borderRadius: "12px",
                background: "linear-gradient(135deg, #00d296, #00a878)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px", boxShadow: "0 4px 20px rgba(0,210,150,0.4)",
              }}>✚</div>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "20px", color: "#fff", letterSpacing: "-0.3px" }}>NutriCheck</span>
            </div>

            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "28px", fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: "16px" }}>
              AI-Powered<br />Healthcare Monitoring
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: 1.7 }}>
              Detect nutritional deficiencies from patient data and find nearby hospitals — all in one place.
            </p>
          </div>

          {/* Feature descriptions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { icon: "🧬", label: "AI Nutrient Analysis", desc: "Upload a patient photo with vitals to detect nutritional deficiencies using a trained ML model." },
              { icon: "🗺️", label: "Live Hospital Finder", desc: "Finds real nearby hospitals using your GPS location and OpenStreetMap data." },
              { icon: "📊", label: "Health Insights", desc: "Get a full BMI report and nutrient index breakdown after each analysis." },
            ].map((f, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "14px",
                padding: "16px 18px", borderRadius: "14px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <span style={{ fontSize: "20px", flexShrink: 0, marginTop: "2px" }}>{f.icon}</span>
                <div>
                  <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, margin: "0 0 4px" }}>{f.label}</p>
                  <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "12px", margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — login form */}
        <div style={{
          width: "420px",
          background: "rgba(8,18,32,0.9)",
          backdropFilter: "blur(30px)",
          padding: "52px 44px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "26px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Welcome back</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "36px" }}>Sign in to your account</p>

          {/* Username */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px" }}>Username</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.4 }}>👤</span>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused("")}
                placeholder="Enter your username"
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "14px 16px 14px 44px",
                  borderRadius: "12px",
                  border: `1px solid ${focused === "username" ? "rgba(0,210,150,0.6)" : "rgba(255,255,255,0.08)"}`,
                  background: "rgba(255,255,255,0.05)",
                  color: "#fff", fontSize: "15px",
                  outline: "none", transition: "all 0.2s",
                  boxShadow: focused === "username" ? "0 0 0 3px rgba(0,210,150,0.1)" : "none",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px" }}>Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.4 }}>🔒</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused("")}
                placeholder="Enter your password"
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "14px 16px 14px 44px",
                  borderRadius: "12px",
                  border: `1px solid ${focused === "password" ? "rgba(0,210,150,0.6)" : "rgba(255,255,255,0.08)"}`,
                  background: "rgba(255,255,255,0.05)",
                  color: "#fff", fontSize: "15px",
                  outline: "none", transition: "all 0.2s",
                  boxShadow: focused === "password" ? "0 0 0 3px rgba(0,210,150,0.1)" : "none",
                }}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: "12px 16px", borderRadius: "10px", marginBottom: "16px",
              background: "rgba(255,60,60,0.1)", border: "1px solid rgba(255,60,60,0.2)",
              color: "#ff6b6b", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px",
            }}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%", padding: "15px",
              borderRadius: "12px", border: "none", cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "rgba(0,210,150,0.4)" : "linear-gradient(135deg, #00d296, #00a878)",
              color: "#fff", fontSize: "15px", fontWeight: 600,
              fontFamily: "'Sora', sans-serif",
              boxShadow: loading ? "none" : "0 8px 30px rgba(0,210,150,0.35)",
              transition: "all 0.2s", letterSpacing: "0.02em",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {loading ? (
              <><span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Signing in...</>
            ) : "Sign In →"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>or</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Sign up link */}
          <button
            onClick={() => navigate("/signup")}
            style={{
              width: "100%", padding: "14px",
              borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent", color: "rgba(255,255,255,0.7)",
              fontSize: "14px", cursor: "pointer", transition: "all 0.2s",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={e => { e.target.style.borderColor = "rgba(0,210,150,0.4)"; e.target.style.color = "#00d296" }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.color = "rgba(255,255,255,0.7)" }}
          >
            Create a new account
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
