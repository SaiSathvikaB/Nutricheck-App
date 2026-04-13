import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera"
import { Capacitor } from "@capacitor/core"
function HealthForm() {
  
  const navigate = useNavigate()
  const [age, setAge] = useState("")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [gender, setGender] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState("")
  const [dragOver, setDragOver] = useState(false)
  const handleCameraOrUpload = async () => {
  try {
    if (Capacitor.isNativePlatform()) {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt, // camera or gallery
        quality: 80,
      })

      // preview (IMPORTANT)
      setImagePreview(photo.dataUrl)

      // convert to file
      const res = await fetch(photo.dataUrl)
      const blob = await res.blob()
      const file = new File([blob], "image.jpg", { type: "image/jpeg" })

      setImage(file)
    } else {
      document.getElementById("fileInput").click()
    }
  } catch (err) {
    console.error("Camera error:", err)
  }
}
  const handleImageChange = (file) => {
    if (!file) return
    setImage(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!age || !height || !weight || !gender || !image) {
      alert("Please fill all fields and upload an image")
      return
    }
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("age", age)
      formData.append("height", height)
      formData.append("weight", weight)
      formData.append("gender", gender)
      formData.append("image", image)
      const res = await axios.post("http://192.168.1.9:5000/predict", formData)
      navigate("/result", { state: res.data })
    } catch (err) {
      console.log("FULL ERROR:", err)
      console.log("RESPONSE:", err?.response)
      alert("Prediction failed")
    }
    finally {
      setLoading(false)
    }
  }

  const inputStyle = (field) => ({
    width: "100%", boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: "12px",
    border: `1px solid ${focused === field ? "rgba(0,210,150,0.6)" : "rgba(255,255,255,0.08)"}`,
    background: "rgba(255,255,255,0.05)",
    color: "#fff", fontSize: "15px",
    outline: "none", transition: "all 0.2s",
    boxShadow: focused === field ? "0 0 0 3px rgba(0,210,150,0.1)" : "none",
    fontFamily: "'DM Sans', sans-serif",
  })

  return (
    <div style={{
      borderRadius: "24px",
      background: "rgba(8,18,32,0.75)",
      border: "1px solid rgba(255,255,255,0.07)",
      backdropFilter: "blur(20px)",
      overflow: "hidden",
      boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
    }}>
      {/* Header strip */}
      <div style={{
        padding: "28px 36px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(0,210,150,0.04)",
        display: "flex", alignItems: "center", gap: "16px",
      }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #00d296, #00a878)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🧬</div>
        <div>
          <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff", margin: 0 }}>Nutrient Analysis</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>Powered by AI • Results in seconds</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: "36px" }}>
        {/* Grid: Age, Height, Weight */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          {[
            { field: "age", label: "Age", placeholder: "e.g. 25", value: age, set: setAge, icon: "🎂" },
            { field: "height", label: "Height (cm)", placeholder: "e.g. 170", value: height, set: setHeight, icon: "📏" },
            { field: "weight", label: "Weight (kg)", placeholder: "e.g. 65", value: weight, set: setWeight, icon: "⚖️" },
          ].map(({ field, label, placeholder, value, set, icon }) => (
            <div key={field}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.55)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px" }}>
                <span>{icon}</span> {label}
              </label>
              <input
                value={value}
                onChange={e => set(e.target.value)}
                onFocus={() => setFocused(field)}
                onBlur={() => setFocused("")}
                placeholder={placeholder}
                style={inputStyle(field)}
              />
            </div>
          ))}
        </div>

        {/* Gender */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.55)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "10px" }}>
            <span>👤</span> Gender
          </label>
          <div style={{ display: "flex", gap: "12px" }}>
            {[{ val: "0", label: "Male", icon: "♂" }, { val: "1", label: "Female", icon: "♀" }].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => setGender(opt.val)}
                style={{
                  flex: 1, padding: "14px 20px", borderRadius: "12px", cursor: "pointer",
                  border: `1px solid ${gender === opt.val ? "rgba(0,210,150,0.6)" : "rgba(255,255,255,0.08)"}`,
                  background: gender === opt.val ? "rgba(0,210,150,0.12)" : "rgba(255,255,255,0.04)",
                  color: gender === opt.val ? "#00d296" : "rgba(255,255,255,0.5)",
                  fontSize: "15px", fontFamily: "'DM Sans', sans-serif",
                  fontWeight: gender === opt.val ? 600 : 400,
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  boxShadow: gender === opt.val ? "0 0 0 3px rgba(0,210,150,0.1)" : "none",
                }}
              >
                <span style={{ fontSize: "18px" }}>{opt.icon}</span> {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: "32px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.55)", fontSize: "12px", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "10px" }}>
            <span>📸</span> Patient Image
          </label>
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleImageChange(e.dataTransfer.files[0]) }}
            onClick={handleCameraOrUpload}
            style={{
              borderRadius: "16px", padding: "32px",
              border: `2px dashed ${dragOver ? "rgba(0,210,150,0.7)" : imagePreview ? "rgba(0,210,150,0.4)" : "rgba(255,255,255,0.1)"}`,
              background: dragOver ? "rgba(0,210,150,0.06)" : imagePreview ? "rgba(0,210,150,0.04)" : "rgba(255,255,255,0.02)",
              cursor: "pointer", transition: "all 0.2s",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px",
            }}
          >
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={(e) => handleImageChange(e.target.files[0])}
            />
            {imagePreview ? (
              <div style={{ textAlign: "center" }}>
                <img src={imagePreview} alt="Preview" style={{ maxHeight: "160px", maxWidth: "100%", borderRadius: "12px", objectFit: "cover", marginBottom: "10px", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }} />
                <p style={{ color: "#00d296", fontSize: "13px" }}>✓ Image ready — click to change</p>
              </div>
            ) : (
              <>
                <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "rgba(0,210,150,0.1)", border: "1px solid rgba(0,210,150,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🧑‍⚕️</div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "15px", fontWeight: 500 }}>Drop patient photo here</p>
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>or click to browse · PNG, JPG, WEBP</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%", padding: "16px", borderRadius: "14px", border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            background: loading ? "rgba(0,210,150,0.4)" : "linear-gradient(135deg, #00d296, #00a878)",
            color: "#fff", fontSize: "16px", fontWeight: 700,
            fontFamily: "'Sora', sans-serif",
            boxShadow: loading ? "none" : "0 8px 32px rgba(0,210,150,0.4)",
            transition: "all 0.2s", letterSpacing: "0.02em",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          }}
        >
          {loading ? (
            <><span style={{ display: "inline-block", width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Analyzing nutrition...</>
          ) : <><span>🔬</span> Analyze My Nutrition</>}
        </button>
        <style>{`@keyframes spin { to{transform:rotate(360deg)} }`}</style>
      </form>
    </div>
  )
}

export default HealthForm
