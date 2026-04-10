import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import First_Page from "./views/First_Page";
import LoginView from './views/LoginView';
import Usuario from "./views/Usuario";
import Ruta_protegida from "../componentes_internos/ruta_protegida";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView />} />

        <Route
          path="/usuario"
          element={
            <Ruta_protegida rolPermitido="Administrador">
              <Usuario />
            </Ruta_protegida>
          }
        />
        <Route path = "/first" element={<MainLayout/>}>
          <Route
            index
            element = {
              <Ruta_protegida>
                <First_Page />
              </Ruta_protegida>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;