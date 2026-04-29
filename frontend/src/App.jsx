import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  FirstPage, Login, Usuario,
  Inventario, RegistrarInsumo,
  RegistrarMedio, Lotes, Pruebas
} from "./pages";
import { MainLayout } from "./shared/components/layout";
import { Notas, VistaTablas } from "./shared/components/ui"
import Ruta_protegida from "../componentes_internos/ruta_protegida";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/** 
         * <Route path="/" element={<Pruebas />} />
          <Route path="/notas" element={<Notas />} />
          <Route path="/tablas" element={<VistaTablas />} />
        */}
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />

        {/* Wrapper principal, permite que exista la sidebar y proteger rutas*/}
        <Route
          element={
            <Ruta_protegida>
              <MainLayout />
            </Ruta_protegida>
          }
        >
          {/* //! Rutas hijas, estas son renderizadas por <Outlet /> en MainLayout para que tengan sidebar */}
          <Route path="/first" element={<FirstPage />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/inventario/micelio/crear" element={<RegistrarMedio />} />
          <Route path="/lotes" element={<Lotes />} />

          <Route path="/inventario/crearInsumo" element={<RegistrarInsumo />} />

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