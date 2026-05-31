import { Routes, Route, Navigate } from "react-router-dom";
import {
    HomePage, Login, Usuario, Inventario,
    Lotes, Lote, BibliotecaGenetica, NotasBloque
} from "../pages";
import { MainLayout, RutaProtegida } from "../shared/components/layout";
import CrearAgar from "../pages/inoculos/agar/CrearAgar";
import CrearMedioLiquido from "../pages/inoculos/medioLiquido/CrearMedioLiquido";
import CrearSemilla from "../pages/inoculos/semillas/CrearSemillas";

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
                <Route path="/home" element={<HomePage />} />

                <Route
                    path="/usuarios"
                    element={
                        <RutaProtegida rolPermitido="Administrador">
                            <Usuario /> 
                        </RutaProtegida>
                    }
                />

                {/* Ruta lotes */}
                <Route path="/lotes" element={<Lotes />} />
                <Route path="/lotes/detalle/:id_lote" element={<Lote />} />

                {/* Notas de bloque */}
                <Route path="/bloque/notas/:id_bloque" element={<NotasBloque />} />

                {/* Rutas inventario */}
                <Route path="/inventario" element={<Inventario />} />

                {/* Rutas biblioteca genetica */}
                <Route path="/inoculos" element={<BibliotecaGenetica />} />

                {/* Rutas inóculos */}
                <Route path="/inoculos/crear/agar" element={<CrearAgar />} />
                <Route path="/inoculos/crear/medio-liquido" element={<CrearMedioLiquido />} />
                <Route path="/inoculos/crear/semilla" element={<CrearSemilla />} />

                {/* Rutas con rol específico */}
                <Route
                    path="/usuario"
                    element={
                        <RutaProtegida rolPermitido="Administrador">
                            <Usuario />
                        </RutaProtegida>
                    }
                />

                <Route path="*" element={<Navigate to="/home" />} />
            </Route>
        </Routes>
    );
}