import { useState } from "react"
import { useNavigate } from "react-router-dom"
import MapView from "../components/MapView"
import { Geolocation } from "@capacitor/geolocation"
import { Capacitor } from "@capacitor/core"

function HospitalsPage() {
  const navigate = useNavigate()
  const [location, setLocation] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [selected, setSelected] = useState(null)
  const [locating, setLocating] = useState(false)

  const logout = () => {
    localStorage.removeItem("user")
    navigate("/")
  }
  

const getLocation = async () => {
  try {
    if (Capacitor.isNativePlatform()) {

      // ✅ ADD THIS
      await Geolocation.requestPermissions()

      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 5000,
      })

      setLocation({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      })
    } else {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setLocation({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          }),
        () => alert("Location permission denied")
      )
    }
  } catch (err) {
    console.log(err)
    alert("Location error: " + err.message)
  }
}
  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      background: "linear-gradient(135deg, #0a1628 0%, #0d2137 40%, #0a2e2a 100%)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Sora:wght@300;400;600;700&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .hospital-card { transition: all 0.2s !important; cursor: pointer; }
        .hospital-card:hover { border-color: rgba(0,120,255,0.4) !important; background: rgba(0,120,255,0.06) !important; }
        .hospital-card.selected { border-color: rgba(0,210,150,0.5) !important; background: rgba(0,210,150,0.06) !important; }
        .logout-btn:hover { color: #ff6b6b !important; border-color: rgba(255,100,100,0.3) !important; }
        .back-btn:hover { color: #00d296 !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* Top nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 28px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,18,32,0.85)", backdropFilter: "blur(20px)",
        flexShrink: 0, zIndex: 20,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button className="back-btn" onClick={() => navigate("/dashboard")} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", width: "36px", height: "36px", borderRadius: "10px", cursor: "pointer", fontSize: "18px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>←</button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg, #00d296, #00a878)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px" }}>✚</div>
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "17px", color: "#fff" }}>NutriCheck</span>
          </div>
          <div style={{ height: "20px", width: "1px", background: "rgba(255,255,255,0.1)" }} />
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Nearby Hospitals</span>
        </div>
        <button className="logout-btn" onClick={logout} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)", padding: "7px 16px", borderRadius: "9px", cursor: "pointer", fontSize: "13px", transition: "all 0.2s" }}>Logout</button>
      </nav>

      {/* Main split panel */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left sidebar */}
        <div style={{
          width: "380px", flexShrink: 0,
          background: "rgba(8,18,32,0.85)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Sidebar header */}
          <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <span style={{ fontSize: "20px" }}>🗺️</span>
              <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "18px", fontWeight: 700, color: "#fff" }}>Find Nearby Hospitals</h2>
            </div>
            <button
              onClick={getLocation}
              disabled={locating}
              style={{
                width: "100%", padding: "13px 20px", borderRadius: "12px", border: "none",
                cursor: locating ? "not-allowed" : "pointer",
                background: location ? "rgba(0,210,150,0.12)" : "linear-gradient(135deg, #0078ff, #0050d0)",
                color: "#fff", fontSize: "14px", fontWeight: 600,
                fontFamily: "'Sora', sans-serif",
                boxShadow: location ? "none" : "0 6px 20px rgba(0,120,255,0.35)",
                border: location ? "1px solid rgba(0,210,150,0.3)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                transition: "all 0.2s",
              }}
            >
              {locating ? (
                <><span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Getting location...</>
              ) : location ? (
                <><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00d296", animation: "pulse 2s infinite" }} /><span style={{ color: "#00d296" }}>Location active</span></>
              ) : (
                <><span>📍</span> Use My Location</>
              )}
            </button>
          </div>

          {/* Hospital list */}
          <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {!location && (
              <div style={{ textAlign: "center", padding: "48px 20px", color: "rgba(255,255,255,0.25)" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.5 }}>📍</div>
                <p style={{ fontSize: "14px", lineHeight: 1.6 }}>Enable your location to discover hospitals near you</p>
              </div>
            )}

            {location && hospitals.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 20px", color: "rgba(255,255,255,0.25)" }}>
                <div style={{ display: "inline-block", width: "24px", height: "24px", border: "2px solid rgba(0,210,150,0.3)", borderTopColor: "#00d296", borderRadius: "50%", animation: "spin 0.7s linear infinite", marginBottom: "16px" }} />
                <p style={{ fontSize: "14px" }}>Searching for hospitals...</p>
              </div>
            )}

            {hospitals.map((h, i) => (
              <div
                key={i}
                className={`hospital-card${selected === h ? " selected" : ""}`}
                onClick={() => setSelected(h)}
                style={{
                  borderRadius: "14px", padding: "18px",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)",
                  marginBottom: "12px",
                  animation: `fadeUp 0.4s ease-out ${i * 0.05}s both`,
                }}
              >
                {/* Hospital name and distance */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "rgba(0,120,255,0.15)", border: "1px solid rgba(0,120,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>🏥</div>
                    <p style={{ fontFamily: "'Sora', sans-serif", color: "#fff", fontSize: "14px", fontWeight: 600, lineHeight: 1.3 }}>{h.name}</p>
                  </div>
                  <span style={{ flexShrink: 0, padding: "3px 10px", borderRadius: "20px", background: "rgba(0,120,255,0.12)", border: "1px solid rgba(0,120,255,0.2)", color: "#4da6ff", fontSize: "11px", fontWeight: 600 }}>
                    {h.distance} km
                  </span>
                </div>

                {/* Address */}
                <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "12px", marginLeft: "42px", marginBottom: "14px", lineHeight: 1.5 }}>{h.address}</p>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", marginLeft: "42px" }}>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{
                      padding: "7px 14px", borderRadius: "8px", textDecoration: "none",
                      background: "rgba(0,120,255,0.12)", border: "1px solid rgba(0,120,255,0.2)",
                      color: "#4da6ff", fontSize: "12px", fontWeight: 600,
                      display: "flex", alignItems: "center", gap: "5px",
                    }}
                  >📍 Directions</a>
                  {h.phone && (
                    <a
                      href={`tel:${h.phone}`}
                      onClick={e => e.stopPropagation()}
                      style={{
                        padding: "7px 14px", borderRadius: "8px", textDecoration: "none",
                        background: "rgba(0,210,150,0.1)", border: "1px solid rgba(0,210,150,0.2)",
                        color: "#00d296", fontSize: "12px", fontWeight: 600,
                        display: "flex", alignItems: "center", gap: "5px",
                      }}
                    >📞 Call</a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Count footer */}
          {hospitals.length > 0 && (
            <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
              {hospitals.length} hospitals found nearby
            </div>
          )}
        </div>

        {/* Map panel */}
        <div style={{ flex: 1, position: "relative" }}>
          {!location ? (
            <div style={{
              height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              color: "rgba(255,255,255,0.2)",
            }}>
              <div style={{ fontSize: "80px", marginBottom: "20px", opacity: 0.3 }}>🗺️</div>
              <p style={{ fontFamily: "'Sora', sans-serif", fontSize: "18px", color: "rgba(255,255,255,0.3)" }}>Map will appear here</p>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.15)" }}>Enable location to load the map</p>
            </div>
          ) : (
            <MapView
              lat={location.lat}
              lon={location.lon}
              hospitals={hospitals}
              setHospitals={setHospitals}
              selected={selected}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default HospitalsPage
