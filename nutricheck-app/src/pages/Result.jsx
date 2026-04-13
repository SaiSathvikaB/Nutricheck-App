import { useLocation, useNavigate } from "react-router-dom"

function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state

  const logout = () => {
    localStorage.removeItem("user")
    navigate("/")
  }


  if (!data) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #0a2e2a 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet" />
        <div style={{ fontSize: "64px", marginBottom: "24px" }}>📊</div>
        <h1 style={{ fontFamily: "'Sora', sans-serif", color: "#fff", fontSize: "24px", marginBottom: "12px" }}>No Results Yet</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "32px" }}>Run an analysis first to see your results here.</p>
        <button onClick={() => navigate("/nutrition")} style={{ padding: "14px 28px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #00d296, #00a878)", color: "#fff", fontSize: "15px", fontWeight: 600, cursor: "pointer", fontFamily: "'Sora', sans-serif" }}>
          Go to Nutrient Check →
        </button>
      </div>
    )
  }

const bmiVal = data.bmi_data?.bmi ? parseFloat(data.bmi_data.bmi) : null
const categoryStyles = {
  "Healthy": {
    color: "#00e676",          // bright green
    bg: "rgba(0,230,118,0.12)",
    border: "rgba(0,230,118,0.4)"
  },
  "Underweight": {
    color: "#5aa9ff",          // blue
    bg: "rgba(90,169,255,0.12)",
    border: "rgba(90,169,255,0.4)"
  },
  "Severe Malnutrition": {
    color: "#7c4dff",          // purple (stronger than blue)
    bg: "rgba(124,77,255,0.12)",
    border: "rgba(124,77,255,0.4)"
  },
  "Overweight": {
    color: "#ffb74d",          // orange
    bg: "rgba(255,183,77,0.12)",
    border: "rgba(255,183,77,0.4)"
  },
  "Overweight Risk": {
    color: "#ff9800",          // deeper orange
    bg: "rgba(255,152,0,0.12)",
    border: "rgba(255,152,0,0.4)"
  },
  "Obese": {
    color: "#ff5252",          // red
    bg: "rgba(255,82,82,0.12)",
    border: "rgba(255,82,82,0.4)"
  }
}




const style = categoryStyles[data.bmi_data?.category] || {
  color: "#aaa",
  bg: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.1)"
}

const bmiInfo = {
  label: data.bmi_data?.category || "Unknown",
  color: style.color,
  bg: style.bg,
  border: style.border
}
const modelOutput = data.model_output || {}

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #0a2e2a 100%)",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet" />

      <div style={{ position: "fixed", top: "-10%", left: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,210,150,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-15%", right: "-5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,120,255,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,210,150,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,150,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        .logout-btn:hover { color: #ff6b6b !important; border-color: rgba(255,100,100,0.3) !important; }
        .back-btn:hover { color: #00d296 !important; }
      `}</style>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,18,32,0.7)", backdropFilter: "blur(20px)",
        position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button className="back-btn" onClick={() => navigate("/nutrition")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", width: "38px", height: "38px", borderRadius: "10px", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #00d296, #00a878)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✚</div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff" }}>NutriCheck</span>
          </div>
        </div>
        <button className="logout-btn" onClick={logout} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "8px 18px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", transition: "all 0.2s" }}>Logout</button>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "60px 40px", position: "relative", zIndex: 1, animation: "fadeUp 0.6s ease-out" }}>
        <div style={{ marginBottom: "40px" }}>
          <p style={{ color: "#00d296", fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>✓ Analysis Complete</p>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "36px", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Your Results</h1>
        </div>

        {/* BMI Hero Card */}
        <div style={{
          borderRadius: "24px", padding: "40px",
          background: "rgba(8,18,32,0.8)",
          border: `1px solid ${bmiInfo.border}`,
          marginBottom: "24px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", gap: "40px",
          backdropFilter: "blur(20px)",
          animation: "scaleIn 0.5s ease-out",
        }}>
          {/* BMI Gauge */}
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <div style={{
              width: "140px", height: "140px", borderRadius: "50%",
              background: bmiInfo.bg,
              boxShadow: `0 0 12px ${bmiInfo.color}20`,
         
              border: `3px solid ${bmiInfo.border}`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              //boxShadow: `0 0 25px ${bmiInfo.color}40, 0 0 60px ${bmiInfo.color}20`,
            }}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "36px", fontWeight: 700, color: bmiInfo.color, margin: 0, lineHeight: 1 }}>{bmiVal.toFixed(1)}</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", margin: "4px 0 0" }}>BMI</p>
            </div>
          </div>

          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 16px", borderRadius: "20px", background: bmiInfo.bg, border: `1px solid ${bmiInfo.border}`, marginBottom: "16px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: bmiInfo.color, animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ color: bmiInfo.color, fontSize: "13px", fontWeight: 600 , textShadow: `0 0 10px ${bmiInfo.color}50`, }}>{bmiInfo.label}</span>
            </div>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Body Mass Index</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", lineHeight: 1.7 }}>
              Your health assessment based on BMI and growth standards is <strong>{bmiInfo.label}</strong>. This is calculated from your height and weight measurements.
            </p>
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>

        {/* Model output */}
        {Object.keys(modelOutput).length > 0 && (
          <div style={{
            borderRadius: "24px", overflow: "hidden",
            background: "rgba(8,18,32,0.8)", border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(20px)", marginBottom: "24px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}>
            <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,210,150,0.04)", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>🧬</span>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: 700, color: "#fff" }}>Nutritional Breakdown</h3>
            </div>
            <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
              {Object.entries(modelOutput).map(([key, value], i) => (
                <div key={i} style={{
                  padding: "18px 20px", borderRadius: "14px",
                  background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                  transition: "border-color 0.2s",
                }}>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>{key.replace(/_/g, " ")}</p>
                  <p style={{ fontFamily: "'Sora', sans-serif", color: "#00d296", fontSize: "20px", fontWeight: 700 }}>{typeof value === "number" ? value.toFixed(2) : String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback raw output */}
        {Object.keys(modelOutput).length === 0 && data.model_output && (
          <div style={{ borderRadius: "24px", overflow: "hidden", background: "rgba(8,18,32,0.8)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: "24px", backdropFilter: "blur(20px)" }}>
            <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: 700, color: "#fff" }}>Raw Analysis Output</h3>
            </div>
            <pre style={{ padding: "24px 32px", color: "#00d296", fontSize: "13px", overflowX: "auto", fontFamily: "monospace", lineHeight: 1.7 }}>{JSON.stringify(data.model_output, null, 2)}</pre>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "16px" }}>
          <button
            onClick={() => navigate("/nutrition")}
            style={{
              flex: 1, padding: "16px", borderRadius: "14px", border: "none",
              background: "linear-gradient(135deg, #00d296, #00a878)",
              color: "#fff", fontSize: "15px", fontWeight: 600, cursor: "pointer",
              fontFamily: "'Sora', sans-serif", boxShadow: "0 8px 28px rgba(0,210,150,0.35)",
            }}
          >🔬 Analyze Again</button>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              flex: 1, padding: "16px", borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.7)", fontSize: "15px", fontWeight: 600,
              cursor: "pointer", fontFamily: "'Sora', sans-serif",
            }}
          >← Back to Dashboard</button>
        </div>
      </div>
    </div>
  )
}

export default Result
