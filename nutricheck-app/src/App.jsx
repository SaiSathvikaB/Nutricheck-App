import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NutritionPage from "./pages/NutritionPage";
import HospitalsPage from "./pages/HospitalsPage";
import Result from "./pages/Result";

function App() {

return (

<BrowserRouter>

<Routes>

<Route path="/" element={<Login />} />

<Route path="/signup" element={<Signup />} />

<Route path="/dashboard" element={<Dashboard />} />

<Route path="/nutrition" element={<NutritionPage />} />

<Route path="/hospitals" element={<HospitalsPage />} />

<Route path="/result" element={<Result />} />

</Routes>

</BrowserRouter>

);

}

export default App;