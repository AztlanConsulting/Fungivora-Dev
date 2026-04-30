import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { colores } from "../ui/basics/colores";
import Text from "../ui/basics/texto";
import ModalConfirmacion from "../ui/popups/modal_confirmacion";

import { HugeiconsIcon } from '@hugeicons/react';
import { Home07FreeIcons, BookOpenTextFreeIcons, PackageIcon, MushroomIcon, Logout02Icon, Door01Icon } from '@hugeicons/core-free-icons';

import fungivora from "/icons/icon-splash-blue.png?url"

const Contenedor_principal = `
    flex flex-row gap-2 p-2 justify-between items-center
    bg-white text-center w-full h-[4.5rem]
    fixed bottom-0 left-0 z-50

    md:flex-col md:w-[5rem] md:h-screen
    md:text-left md:sticky md:top-0
`

const LogoDiv = `
  hidden 
  md:flex md:flex-col md:p-2 md:flex-row
`;

/* Si algo truena de la imagen revisa aqui primero*/
const LogoImg = `
  hidden 
  md:block
`;

const Contenedor_iconos = `
    flex flex-1 flex-row gap-1 justify-evenly p-2
    md:flex-col md:gap-8 md:justify-center
`
const Tooltip = `
    absolute left-[4.5rem] p-2
    text-white rounded-[0.875rem]
    whitespace-nowrap

    opacity-0 pointer-events-none 
    transition-opacity duration-200
    hover:opacity-0 md:group-hover:opacity-100
`

const Botones = `
    flex relative items-center justify-center
    p-2 self-center rounded-lg transition-colors
    group
`

const Barra_navegacion = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const confirmarCerrarSesion = () => {
        localStorage.removeItem("token");
        setShowModal(false); 
        navigate("/"); 
    };

    return (
    <>
        <nav className={Contenedor_principal}>
            {/* Logo Fungivora */}
            <div className={LogoDiv}><img src={fungivora} className={LogoImg} /> </div>

            {/* Este contenedor lleva los iconos de toda la navbar*/}
            <div className={Contenedor_iconos}>

                {/* Home */}
                <NavLink
                    to="/first"
                    className={({ isActive }) =>
                        `${Botones} ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                    }>
                    <HugeiconsIcon icon={Home07FreeIcons} size={33} color={colores.azul} strokeWidth={1.5} />
                    <span className={Tooltip}
                        style={{ backgroundColor: colores.azul, color: colores.blanco }}>
                        Inicio
                    </span>
                </NavLink>

                {/* lotes */}
                <NavLink
                    to="/lotes"
                    className={({ isActive }) =>
                        `${Botones} ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                    }>
                    <HugeiconsIcon icon={BookOpenTextFreeIcons} size={33} color={colores.azul} strokeWidth={1.5} />
                    <span className={Tooltip}
                        style={{ backgroundColor: colores.azul, color: colores.blanco }}>
                        Lotes
                    </span>
                </NavLink>

                {/* Inventario */}
                <NavLink
                    to="/inventario"
                    className={({ isActive }) =>
                        `${Botones} ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                    }>
                    <HugeiconsIcon icon={PackageIcon} size={33} color={colores.azul} strokeWidth={1.5} />
                    <span className={Tooltip}
                        style={{ backgroundColor: colores.azul, color: colores.blanco }}>
                        Inventario
                    </span>
                </NavLink>

                {/* Recetario */}
                <NavLink
                    to="/recetario"
                    className={({ isActive }) =>
                        `${Botones} ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                    }>
                    <HugeiconsIcon icon={MushroomIcon} size={33} color={colores.azul} strokeWidth={1.5} />
                    <span className={Tooltip}
                        style={{ backgroundColor: colores.azul, color: colores.blanco }}>
                        Biblioteca genética
                    </span>
                </NavLink>

                {/* Log Out*/}
                <button 
                        onClick={() => setShowModal(true)}
                        className={`${Botones} hover:bg-gray-100`}
                    >
                    <HugeiconsIcon icon={Logout02Icon} size={33} color={colores.azul} strokeWidth={1.5} />
                    <span className={Tooltip}
                        style={{ backgroundColor: colores.azul, color: colores.blanco }}>
                        Cerrar sesión
                    </span>
                </button>
            </div>
        </nav>

        {/* Modal para poder confirmar el cierre de sesión*/}
        <ModalConfirmacion
                visible={showModal}
                icon={Door01Icon}
                titulo="¿Confirmar cierre de sesión?"
                descripcion="Para volver a acceder, debes iniciar sesión nuevamente"
                onConfirm={confirmarCerrarSesion}
                onCancel={() => setShowModal(false)}
            />
        </>
    )
}

export default Barra_navegacion;