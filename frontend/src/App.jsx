import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import First_Page from "./views/First_Page";
import Login from "./views/Login";
import Usuario from "./views/Usuario";
import ProtectedRoute from "../components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔥 Ruta base */}
        <Route path="/" element={<Login />} />

        <Route path="/first" element={<First_Page />} />

        <Route
          path="/usuario"
          element={
            <ProtectedRoute rolPermitido="Administrador">
              <Usuario />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;