import React from "react";
import Barra_navegacion from "../layout/barra_navegacion";
import { Outlet } from "react-router-dom";

export default function MainLayout () {
    return (
        <div className="flex flex-col-reverse min-h-dvh md:flex-row">
            <Barra_navegacion />

            {/* //! Outlet se encarga de renderizar la vista sin desaparecer la barra de navegacion */}
            <main className="flex-1">
                <Outlet />
            </main>


        </div>
    )
}