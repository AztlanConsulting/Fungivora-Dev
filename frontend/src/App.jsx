import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import First_Page from "./views/First_Page";
import LoginView from './views/LoginView';
import Usuario from "./views/Usuario";
import RegistrarMedioLiquido from "./views/NewMedio"; 
import Inventario from "./views/Inventario";
import Ruta_protegida from "../componentes_internos/ruta_protegida";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/inventario" element={<Inventario />} />

        <Route
          path="/usuario"
          element={
            <Ruta_protegida rolPermitido="Administrador">
              <Usuario />
            </Ruta_protegida>
          }
        />
        <Route
          path="/first"
          element={
            <Ruta_protegida>
              <First_Page />
            </Ruta_protegida>
          }
        />
        <Route
          path="/inventario/micelio/crear"
          element={
            <Ruta_protegida>
              <RegistrarMedioLiquido />
            </Ruta_protegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;