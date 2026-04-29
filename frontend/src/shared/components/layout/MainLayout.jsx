import React from "react";
import { BarraBusqueda } from "../ui";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="flex flex-col-reverse min-h-dvh md:flex-row">
            <BarraBusqueda />

            {/* //! Outlet se encarga de renderizar la vista sin desaparecer la barra de navegacion */}
            <main className="flex-1">
                <Outlet />
            </main>


        </div>
    )
}