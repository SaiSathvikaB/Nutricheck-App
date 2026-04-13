import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { useEffect } from "react"
import axios from "axios"
import L from "leaflet"

// Custom user marker icon
const userIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 20px; height: 20px; border-radius: 50%;
    background: #00d296;
    border: 3px solid rgba(0,210,150,0.3);
    box-shadow: 0 0 0 6px rgba(0,210,150,0.15), 0 4px 12px rgba(0,0,0,0.4);
    position: relative;
  "><div style="
    position: absolute; inset: -8px;
    border-radius: 50%;
    border: 1px solid rgba(0,210,150,0.2);
    animation: pulse 2s ease-in-out infinite;
  "></div></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

// Custom hospital marker icon
const hospitalIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, #0078ff, #0050d0);
    border: 2px solid rgba(77,166,255,0.4);
    box-shadow: 0 4px 16px rgba(0,120,255,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
  ">🏥</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

// Selected hospital marker
const selectedHospitalIcon = L.divIcon({
  className: "",
  html: `<div style="
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, #00d296, #00a878);
    border: 2px solid rgba(0,210,150,0.6);
    box-shadow: 0 0 0 6px rgba(0,210,150,0.15), 0 6px 20px rgba(0,210,150,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  ">🏥</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
})

function MapUpdater({ selected }) {
  const map = useMap()
  useEffect(() => {
    if (selected) map.setView([selected.lat, selected.lon], 15, { animate: true })
  }, [selected, map])
  return null
}

function MapView({ lat, lon, hospitals, setHospitals, selected }) {
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get(`http://192.168.1.9:5000/hospitals?lat=${lat}&lon=${lon}`)
        setHospitals(res.data.hospitals)
      } catch (err) {
        console.error("Failed to fetch hospitals:", err)
      }
    }
    fetchHospitals()
  }, [lat, lon, setHospitals])

  return (
    <>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
        .leaflet-container { height: 100%; width: 100%; background: #e8e8e8; }
        .leaflet-popup-content-wrapper {
          background: rgba(8,18,32,0.95) !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
          border-radius: 14px !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important;
          backdrop-filter: blur(20px) !important;
          color: #fff !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        .leaflet-popup-tip { background: rgba(8,18,32,0.95) !important; }
        .leaflet-popup-close-button { color: rgba(255,255,255,0.4) !important; font-size: 16px !important; top: 12px !important; right: 12px !important; }
        .leaflet-popup-close-button:hover { color: #ff6b6b !important; }
        .leaflet-control-zoom a {
          background: rgba(8,18,32,0.9) !important;
          border-color: rgba(255,255,255,0.1) !important;
          color: rgba(255,255,255,0.7) !important;
        }
        .leaflet-control-zoom a:hover { background: rgba(0,210,150,0.15) !important; color: #00d296 !important; }
        .leaflet-control-attribution { display: none !important; }
      `}</style>
      <MapContainer
        center={[lat, lon]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution=""
        />
        <MapUpdater selected={selected} />

        {/* User location */}
        <Marker position={[lat, lon]} icon={userIcon}>
          <Popup>
            <div style={{ padding: "4px 0" }}>
              <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "14px", color: "#00d296", margin: "0 0 4px" }}>📍 Your Location</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", margin: 0 }}>
                {lat.toFixed(4)}, {lon.toFixed(4)}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* Hospital markers */}
        {hospitals.map((h, i) => (
          <Marker
            key={i}
            position={[h.lat, h.lon]}
            icon={selected === h ? selectedHospitalIcon : hospitalIcon}
          >
            <Popup>
              <div style={{ padding: "4px 0", minWidth: "180px" }}>
                <p style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "14px", color: "#fff", margin: "0 0 6px", lineHeight: 1.3 }}>{h.name}</p>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", margin: "0 0 10px", lineHeight: 1.5 }}>{h.address}</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ padding: "4px 10px", borderRadius: "8px", background: "rgba(0,120,255,0.15)", border: "1px solid rgba(0,120,255,0.2)", color: "#4da6ff", fontSize: "11px", fontWeight: 600 }}>
                    📍 {h.distance} km
                  </span>
                  {h.phone && (
                    <a href={`tel:${h.phone}`} style={{ padding: "4px 10px", borderRadius: "8px", background: "rgba(0,210,150,0.1)", border: "1px solid rgba(0,210,150,0.2)", color: "#00d296", fontSize: "11px", fontWeight: 600, textDecoration: "none" }}>
                      📞 Call
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  )
}

export default MapView
