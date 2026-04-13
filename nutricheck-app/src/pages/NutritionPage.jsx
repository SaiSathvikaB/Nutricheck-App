import HealthForm from "../components/HealthForm"
import { useNavigate } from "react-router-dom"

function NutritionPage() {
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

      {/* Background */}
      <div style={{ position: "fixed", top: "-10%", left: "-5%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,210,150,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-15%", right: "-5%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,120,255,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,210,150,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,150,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .logout-btn:hover { color: #ff6b6b !important; border-color: rgba(255,100,100,0.3) !important; }
        .back-btn:hover { color: #00d296 !important; }
      `}</style>

      {/* Top nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,18,32,0.7)",
        backdropFilter: "blur(20px)",
        position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            className="back-btn"
            onClick={() => navigate("/dashboard")}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)", width: "38px", height: "38px",
              borderRadius: "10px", cursor: "pointer", fontSize: "18px",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
          >←</button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #00d296, #00a878)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>✚</div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff" }}>NutriCheck</span>
          </div>
        </div>
        <button
          className="logout-btn"
          onClick={logout}
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "8px 18px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", transition: "all 0.2s" }}
        >Logout</button>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "60px 40px", position: "relative", zIndex: 1, animation: "fadeUp 0.6s ease-out" }}>
        <div style={{ marginBottom: "40px" }}>
          <p style={{ color: "#00d296", fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>🧬 AI Analysis</p>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: "36px", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "12px" }}>Nutrient Check</h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px" }}>Fill in the patient's details and upload a photo to get an AI-powered nutritional deficiency analysis.</p>
        </div>

        <HealthForm />
      </div>
    </div>
  )
}

export default NutritionPage
