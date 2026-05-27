import React from "react";
import Barra_navegacion from "./BarraNavegacion";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        // Añadimos overscroll-none aquí
        <div className="flex flex-col-reverse md:flex-row w-screen h-screen overflow-hidden bg-gray-50 overscroll-none">
            <Barra_navegacion />

            {/* También blindamos el contenedor que tiene el scroll real */}
            <main className="flex-1 h-full overflow-y-auto overscroll-none">
                <Outlet />
            </main>
        </div>
    );
}