import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import First_Page from "./views/First_Page";
import LoginView from './views/LoginView';
import Usuario from "./views/Usuario";

import Inventario from "./views/inventario/Inventario";
import PruebaInsumo from "./views/inventario/RegistrarInsumo";

import RegistrarMedioLiquido from "./views/NewMedio";

import Ruta_protegida from "../componentes_internos/ruta_protegida";
import MainLayout from "./layouts/MainLayout";
import Experimentos from "./views/ExperimentosView";
import Recetario from "./views/RecetarioView"
import Lotes from "./views/LotesView";
import Pruebas from "./views/pruba_componentes";
import Notas from "./componentes/template/notas";

import VistaTablas from "./views/vista_tablas";

function App() {
  return (
 <BrowserRouter>
      <Routes>
        {/*<Route path="/" element={<LoginView />} />*/}

        <Route element={<MainLayout />}>
          <Route path="/" element={<Pruebas />} />
          <Route path="/notas" element={<Notas />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/tablas" element={<VistaTablas />} />


        

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
        <Route path="/inventario/micelio/crear" element={<RegistrarMedioLiquido />} />
        <Route path="/experimentos" element={<Experimentos />} />
        <Route path="/recetario" element={<Recetario />} />
        <Route path="/lotes" element={<Lotes />} />

        <Route path="/inventario/crearInsumo" element={<PruebaInsumo />} />

        {/* Rutas protegidas hijas */}
        <Route
          path="/usuario"
          element={
            <Ruta_protegida rolPermitido="Administrador">
              <Usuario />
            </Ruta_protegida>
          }
        />
       
          
           <Route path="*" element={<Navigate to="/first" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;