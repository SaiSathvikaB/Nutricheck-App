import { useNavigate } from "react-router-dom"

function Dashboard() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem("user")
    navigate("/")
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #0a2e2a 100%)",
      fontFamily: "'DM Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet" />

      {/* Background orbs */}
      <div style={{ position: "fixed", top: "-10%", left: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,210,150,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-15%", right: "-5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,120,255,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,210,150,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,150,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-12px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardHover { 0%{transform:translateY(0)} }
        .dash-card { transition: transform 0.25s ease, box-shadow 0.25s ease !important; cursor: pointer; }
        .dash-card:hover { transform: translateY(-6px) !important; }
        .logout-btn:hover { color: #ff6b6b !important; border-color: rgba(255,100,100,0.3) !important; }
      `}</style>

      {/* Top navigation */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,18,32,0.7)",
        backdropFilter: "blur(20px)",
        position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #00d296, #00a878)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", boxShadow: "0 4px 16px rgba(0,210,150,0.35)" }}>✚</div>
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff" }}>NutriCheck</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "linear-gradient(135deg, #00d296, #0078ff)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#fff" }}>U</div>
          <button
            className="logout-btn"
            onClick={logout}
            style={{
              background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)", padding: "8px 18px",
              borderRadius: "10px", cursor: "pointer", fontSize: "13px",
              transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 40px", position: "relative", zIndex: 1, animation: "fadeUp 0.6s ease-out" }}>
        {/* Welcome */}
        <div style={{ marginBottom: "56px" }}>
          <p style={{ color: "#00d296", fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>Dashboard</p>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "38px", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "12px" }}>
            Good to see you 👋
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px" }}>What would you like to check today?</p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "48px" }}>
          {/* Nutrition Card */}
          <div
            className="dash-card"
            onClick={() => navigate("/nutrition")}
            style={{
              borderRadius: "24px", padding: "36px",
              background: "linear-gradient(135deg, rgba(0,210,150,0.18) 0%, rgba(0,168,120,0.08) 100%)",
              border: "1px solid rgba(0,210,150,0.2)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,210,150,0.15) 0%, transparent 70%)" }} />
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #00d296, #00a878)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", marginBottom: "24px", boxShadow: "0 8px 24px rgba(0,210,150,0.4)" }}>🧬</div>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Nutrient Check</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: 1.6, marginBottom: "28px" }}>Upload a food photo and get instant AI-powered nutritional analysis with deficiency insights.</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#00d296", fontSize: "14px", fontWeight: 600 }}>
              <span>Analyze Now</span>
              <span>→</span>
            </div>
          </div>

          {/* Hospitals Card */}
          <div
            className="dash-card"
            onClick={() => navigate("/hospitals")}
            style={{
              borderRadius: "24px", padding: "36px",
              background: "linear-gradient(135deg, rgba(0,120,255,0.18) 0%, rgba(0,80,200,0.08) 100%)",
              border: "1px solid rgba(0,120,255,0.2)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,120,255,0.15) 0%, transparent 70%)" }} />
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #0078ff, #0050d0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", marginBottom: "24px", boxShadow: "0 8px 24px rgba(0,120,255,0.4)" }}>🗺️</div>
            <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Nearby Hospitals</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: 1.6, marginBottom: "28px" }}>Find hospitals and clinics closest to your current location with directions and contact details.</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#4da6ff", fontSize: "14px", fontWeight: 600 }}>
              <span>Find Care</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* Feature info bar */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px",
          padding: "28px 32px", borderRadius: "20px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {[
            { icon: "🧬", label: "How it works", value: "Upload a patient photo with your vitals for AI-driven nutrient deficiency detection." },
            { icon: "📍", label: "Location-based", value: "Uses your live GPS to find real hospitals and clinics around you via OpenStreetMap." },
            { icon: "📊", label: "What you get", value: "BMI calculation, nutrient index breakdown, and hospital directions — all in one place." },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "20px" }}>{item.icon}</span>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>{item.label}</p>
              </div>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", lineHeight: 1.6, margin: 0 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
