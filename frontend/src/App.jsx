import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import First_Page from "./views/First_Page";
import LoginView from './views/LoginView';
import Usuario from "./views/Usuario";
import Inventario from "./views/inventario/Inventario";
import PruebaInsumo from "./views/inventario/RegistrarInsumo";
import Ruta_protegida from "../componentes_internos/ruta_protegida";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView />} />

        <Route path="/inventario/crearInsumo" element={<PruebaInsumo />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;