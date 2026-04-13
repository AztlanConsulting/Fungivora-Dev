import { BrowserRouter, Routes, Route } from 'react-router-dom';
import First_Page from "./views/First_Page";
import LoginView from './views/LoginView';
import Usuario from "./views/Usuario";
import Inventario from "./views/Inventario";
import Ruta_protegida from "../componentes_internos/ruta_protegida";
import MainLayout from "./layouts/MainLayout";
import Experimentos from "./views/ExperimentosView";
import Recetario from "./views/RecetarioView";
import Lotes from "./views/LotesView";
import SeleccionarSemilla from "./views/selecionarsemilla";
import RegistrarSemilla from "./views/registrar_semilla";
import SeleccionarAgar from "./views/selecionaragar";
import RegistrarAgar from "./views/registrar_agar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView />} />

        {/* Wrapper principal, permite que exista la sidebar y proteger rutas */}
        <Route
          element={
            <Ruta_protegida>
              <MainLayout />
            </Ruta_protegida>
          }
        >
          {/* Rutas hijas — renderizadas por <Outlet /> en MainLayout */}
          <Route path="/first" element={<First_Page />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/experimentos" element={<Experimentos />} />
          <Route path="/recetario" element={<Recetario />} />
          <Route path="/lotes" element={<Lotes />} />

          {/* Tus rutas de semilla y agar */}
          <Route path="/inventario/seleccionar-semilla" element={<SeleccionarSemilla />} />
          <Route path="/inventario/registrarsemilla"    element={<RegistrarSemilla />} />
          <Route path="/inventario/seleccionar-agar"    element={<SeleccionarAgar />} />
          <Route path="/inventario/registraragar"       element={<RegistrarAgar />} />

          {/* Rutas protegidas hijas */}
          <Route
            path="/usuario"
            element={
              <Ruta_protegida rolPermitido="Administrador">
                <Usuario />
              </Ruta_protegida>
            }
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;