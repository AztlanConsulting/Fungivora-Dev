import React from "react";
import { NavLink } from "react-router-dom";
import { colores } from "./colores";
import Text from "./texto";
import { HugeiconsIcon } from '@hugeicons/react';
import { Home07FreeIcons, BookOpenTextFreeIcons, PackageIcon, MushroomIcon, Logout02Icon} from '@hugeicons/core-free-icons';
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

const Botones =`
    flex relative items-center justify-center
    p-2 self-center rounded-lg transition-colors
    group
`

const Barra_navegacion = () => {
    return (
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
                    <HugeiconsIcon icon={Home07FreeIcons} size={40} color={colores.azul} strokeWidth={1.5} />
                    <span className={Tooltip}
                    style={{ backgroundColor: colores.azul, color: colores.blanco }}>
                        Inicio
                    </span>
                </NavLink>

                {/* Experimentos */}
                <NavLink 
                    to="/experimentos"
                    className={({ isActive }) => 
                        `${Botones} ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                    }> 
                    <HugeiconsIcon icon={BookOpenTextFreeIcons} size={40} color={colores.azul} strokeWidth={1.5} />
                    <span className={Tooltip}
                    style={{ backgroundColor: colores.azul, color: colores.blanco }}>
                        Experimentos
                    </span>
                </NavLink>

                {/* Inventario */}
                <NavLink 
                    to="/inventario"
                    className={({ isActive }) => 
                        `${Botones} ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                    }> 
                    <HugeiconsIcon icon={PackageIcon} size={40} color={colores.azul} strokeWidth={1.5} />
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
                    <HugeiconsIcon icon={MushroomIcon} size={40} color={colores.azul} strokeWidth={1.5} />
                    <span className={Tooltip}
                    style={{ backgroundColor: colores.azul, color: colores.blanco }}>
                        Recetario
                    </span>
                </NavLink>

                {/* Log Out*/}
                <button 
                    className={`${Botones} hover:bg-gray-100`}>
                    <HugeiconsIcon icon={Logout02Icon} size={40} color={colores.azul} strokeWidth={1.5} />
                    <span className={Tooltip}
                    style={{ backgroundColor: colores.azul, color: colores.blanco }}>
                        Log Out
                    </span>
                </button>
            </div>
        </nav>
    )
}

export default Barra_navegacion;