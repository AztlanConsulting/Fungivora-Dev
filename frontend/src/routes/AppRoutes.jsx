import { Routes, Route, Navigate } from "react-router-dom";
import {
    FirstPage, Login, Usuario, Inventario,
     RegistrarMedio, Lotes,
    Lote, BibliotecaGenetica
} from "../pages";
import { MainLayout, RutaProtegida } from "../shared/components/layout";
import FormAgar from "../pages/inoculos/agar/Formagar";
import FormMedioLiquido from "../pages/inoculos/medioLiquido/FormMedioLiquido";
import FormSemilla from "../pages/inoculos/semillas/FormSemillas";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />

            {/* Rutas con layout + protección base */}
            <Route
                element={
                    <RutaProtegida>
                        <MainLayout />
                    </RutaProtegida>
                }
            >
                {/* Ruta home */}
                <Route path="/first" element={<FirstPage />} />

                {/* Ruta lotes */}
                <Route path="/lotes" element={<Lotes />} />
                <Route path="/lotes/detalle/:id_lote" element={<Lote />} />

                {/* Rutas inventario */}
                <Route path="/inventario" element={<Inventario />} />
                <Route path="/inventario/micelio/crear" element={<RegistrarMedio />} />

                {/* Rutas biblioteca genetica */}
                <Route path="/inoculos" element={<BibliotecaGenetica />} />

                {/* Rutas inóculos */}
                <Route path="/inoculos/crear/agar" element={<FormAgar />} />
                <Route path="/inoculos/crear/medio-liquido" element={<FormMedioLiquido />} />
                <Route path="/inoculos/crear/semilla" element={<FormSemilla />} />

                {/* Rutas con rol específico */}
                <Route
                    path="/usuario"
                    element={
                        <RutaProtegida rolPermitido="Administrador">
                            <Usuario />
                        </RutaProtegida>
                    }
                />

                <Route path="*" element={<Navigate to="/first" />} />
            </Route>
        </Routes>
    );
}