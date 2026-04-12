import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import First_Page from "./views/First_Page";
import LoginView from './views/LoginView';
import Usuario from "./views/Usuario";
import Inventario from "./views/Inventario";
import Ruta_protegida from "../componentes_internos/ruta_protegida";
import MainLayout from "./layouts/MainLayout";
import Experimentos from "./views/ExperimentosView";
import Recetario from "./views/RecetarioView"
import Lotes from "./views/LotesView"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView />} />

        {/* Wrapper principal, permite que exista la sidebar y proteger rutas*/}
        <Route
          element={
            <Ruta_protegida>
              <MainLayout />
            </Ruta_protegida>
          }
        >
          {/* //! Rutas hijas, estas son renderizadas por <Outlet /> en MainLayout para que tengan sidebar */}
          <Route path="/first" element={<First_Page />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/experimentos" element={<Experimentos />} />
          <Route path="/recetario" element={<Recetario />} />
          <Route path="/lotes" element={<Lotes />} />
          
          {/* Rutas protegidas hijas */}
          <Route
            path="/usuario"
            element= {
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