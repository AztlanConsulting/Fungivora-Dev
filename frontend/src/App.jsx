import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import First_Page from "./views/First_Page";
import LoginView from './views/LoginView';
import Usuario from "./views/Usuario";
import Inventario from "./views/Inventario";
import Ruta_protegida from "../componentes_internos/ruta_protegida";
import SeleccionarSemilla from "./views/selecionarsemilla";
import RegistrarSemilla from "./views/registrar_semilla";
import RegistrarAgar from "./views/registrar_agar";
import SeleccionarAgar from "./views/selecionaragar";

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
          path="/inventario/seleccionar-semilla"
          element={
            <Ruta_protegida>
              <SeleccionarSemilla />
            </Ruta_protegida>
          }
        />
        <Route path="/inventario/registrarsemilla" element={
          <Ruta_protegida>
            <RegistrarSemilla />
            </Ruta_protegida>
} />
        <Route 
          path="/inventario/seleccionar-agar" 
          element={
            <Ruta_protegida>
              <SeleccionarAgar />
            </Ruta_protegida>
          }
        />
        <Route path="/inventario/registraragar" element={
          <Ruta_protegida>
            <RegistrarAgar />
            </Ruta_protegida>
} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;