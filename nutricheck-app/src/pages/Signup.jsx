import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../services/supabaseClient"
import bcrypt from "bcryptjs"

function Signup() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [msg, setMsg] = useState("")
  const [msgType, setMsgType] = useState("error")
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState("")

  const handleSignup = async () => {
    if (!username || !password) { setMsg("Please fill in all fields"); setMsgType("error"); return }
    if (password !== confirm) { setMsg("Passwords do not match"); setMsgType("error"); return }
    if (password.length < 6) { setMsg("Password must be at least 6 characters"); setMsgType("error"); return }

    setLoading(true)
    setMsg("")
    const hashed = await bcrypt.hash(password, 10)
    const { error } = await supabase.from("users").insert([{ username, password: hashed }])

    if (error) {
      setMsg(error.message)
      setMsgType("error")
    } else {
      setMsg("Account created! Redirecting...")
      setMsgType("success")
      setTimeout(() => navigate("/"), 1500)
    }
    setLoading(false)
  }

  const inputStyle = (field) => ({
    width: "100%", boxSizing: "border-box",
    padding: "14px 16px 14px 44px",
    borderRadius: "12px",
    border: `1px solid ${focused === field ? "rgba(0,210,150,0.6)" : "rgba(255,255,255,0.08)"}`,
    background: "rgba(255,255,255,0.05)",
    color: "#fff", fontSize: "15px",
    outline: "none", transition: "all 0.2s",
    boxShadow: focused === field ? "0 0 0 3px rgba(0,210,150,0.1)" : "none",
  })

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
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,120,255,0.1) 0%, transparent 70%)", animation: "float2 9s ease-in-out infinite" }} />
      <div style={{ position: "absolute", bottom: "-15%", left: "-5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,210,150,0.1) 0%, transparent 70%)", animation: "float1 11s ease-in-out infinite" }} />

      {/* Grid pattern */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,210,150,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,150,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      {[
        { icon: "♥", top: "12%", right: "8%", size: "24px", delay: "0s", opacity: 0.13 },
        { icon: "✚", top: "65%", left: "7%", size: "28px", delay: "1.5s", opacity: 0.12 },
        { icon: "◎", top: "30%", left: "5%", size: "20px", delay: "0.8s", opacity: 0.1 },
        { icon: "⚕", bottom: "25%", right: "9%", size: "26px", delay: "2s", opacity: 0.1 },
      ].map((item, i) => (
        <div key={i} style={{ position: "absolute", top: item.top, left: item.left, right: item.right, bottom: item.bottom, fontSize: item.size, color: "#00d296", opacity: item.opacity, animation: `float1 ${6 + i}s ease-in-out infinite ${item.delay}` }}>{item.icon}</div>
      ))}

      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-20px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(20px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes successPop { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
      `}</style>

      <div style={{
        display: "flex", width: "900px", maxWidth: "95vw", minHeight: "580px",
        borderRadius: "28px", overflow: "hidden",
        boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,210,150,0.1)",
        animation: "fadeUp 0.7s ease-out", position: "relative", zIndex: 1,
      }}>
        {/* Left form panel */}
        <div style={{
          width: "420px",
          background: "rgba(8,18,32,0.9)",
          backdropFilter: "blur(30px)",
          padding: "52px 44px",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          {/* Back to login */}
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.4)", fontSize: "13px",
              display: "flex", alignItems: "center", gap: "6px",
              marginBottom: "32px", padding: 0, transition: "color 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "#00d296"}
            onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
          >
            ← Back to login
          </button>

          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "26px", fontWeight: 700, color: "#fff", marginBottom: "6px" }}>Create account</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "36px" }}>Join NutriCheck — it's free</p>

          {/* Username */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px" }}>Username</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.4 }}>👤</span>
              <input value={username} onChange={e => setUsername(e.target.value)} onFocus={() => setFocused("username")} onBlur={() => setFocused("")} placeholder="Choose a username" style={inputStyle("username")} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px" }}>Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.4 }}>🔒</span>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setFocused("password")} onBlur={() => setFocused("")} placeholder="Create a password" style={inputStyle("password")} />
            </div>
          </div>

          {/* Confirm password */}
          <div style={{ marginBottom: "28px" }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px" }}>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", opacity: 0.4 }}>✓</span>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} onFocus={() => setFocused("confirm")} onBlur={() => setFocused("")} placeholder="Confirm your password" style={inputStyle("confirm")} />
            </div>
          </div>

          {/* Message */}
          {msg && (
            <div style={{
              padding: "12px 16px", borderRadius: "10px", marginBottom: "16px",
              background: msgType === "success" ? "rgba(0,210,150,0.1)" : "rgba(255,60,60,0.1)",
              border: `1px solid ${msgType === "success" ? "rgba(0,210,150,0.25)" : "rgba(255,60,60,0.2)"}`,
              color: msgType === "success" ? "#00d296" : "#ff6b6b",
              fontSize: "13px", display: "flex", alignItems: "center", gap: "8px",
              animation: "successPop 0.3s ease-out",
            }}>
              {msgType === "success" ? "✓" : "⚠"} {msg}
            </div>
          )}

          {/* Signup button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            style={{
              width: "100%", padding: "15px", borderRadius: "12px", border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              background: loading ? "rgba(0,210,150,0.4)" : "linear-gradient(135deg, #00d296, #00a878)",
              color: "#fff", fontSize: "15px", fontWeight: 600,
              fontFamily: "'Sora', sans-serif",
              boxShadow: loading ? "none" : "0 8px 30px rgba(0,210,150,0.35)",
              transition: "all 0.2s", letterSpacing: "0.02em",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {loading ? (
              <><span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Creating account...</>
            ) : "Create Account →"}
          </button>

          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "13px", marginTop: "24px" }}>
            Already have an account?{" "}
            <span onClick={() => navigate("/")} style={{ color: "#00d296", cursor: "pointer", textDecoration: "none" }}>Sign in</span>
          </p>
        </div>

        {/* Right panel */}
        <div style={{
          flex: 1,
          background: "linear-gradient(160deg, rgba(0,210,150,0.15) 0%, rgba(0,60,40,0.4) 100%)",
          backdropFilter: "blur(20px)",
          borderLeft: "1px solid rgba(0,210,150,0.12)",
          padding: "52px 44px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "52px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #00d296, #00a878)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", boxShadow: "0 4px 20px rgba(0,210,150,0.4)" }}>✚</div>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "20px", color: "#fff", letterSpacing: "-0.3px" }}>NutriCheck</span>
            </div>

            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "28px", fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: "16px" }}>
              Start Your<br />Health Journey Today
            </h2>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: 1.7 }}>
              Get personalized insights about your nutrition and find healthcare near you in seconds.
            </p>
          </div>

          {/* Feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { icon: "🧬", title: "AI Nutrient Analysis", desc: "Upload a meal photo for instant breakdown" },
              { icon: "🗺️", title: "Hospital Finder", desc: "Locate care centers near your location" },
              { icon: "📊", title: "Health Insights", desc: "Track BMI, deficiencies, and more" },
            ].map((f, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: "16px",
                padding: "16px 18px", borderRadius: "14px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <span style={{ fontSize: "22px" }}>{f.icon}</span>
                <div>
                  <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, margin: 0 }}>{f.title}</p>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
