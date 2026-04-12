import { NavLink, Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Home07FreeIcons, BookOpenTextFreeIcons, PackageIcon, MushroomIcon, NaturalFoodIcon, } from '@hugeicons/core-free-icons';
import fungivora from "/icons/icon-512x512.png?url"
import '../styles/navbar.css'

export default function MainLayout () {
    /* Esto se encarga de actualizar el tamanio de los iconos al cambiar a vista chica */
    const [iconSize, setIconSize] = useState(window.innerWidth < 768 ? 28 : 40);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIconSize(30);
            }
            else {
                setIconSize(40);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);

    }, []);

    return (
        <div className="layout">
            <aside>
                <nav className="barra-lateral">

                    {/* Logo Fungivora */}
                    <div className="logo-div"><img src={fungivora} className="fungivora" /> </div>
                    
                    {/* Este contenedor lleva los iconos de toda la navbar*/}
                    <div className="contenedor-principal-nav">

                        {/* Home */}
                        <NavLink
                            to="/first"
                            className={({ isActive }) => 
                                `botones p-2 self-center rounded-lg transition-colors ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                            }>
                            <HugeiconsIcon icon={Home07FreeIcons} size={iconSize} color="#3b3fb6" strokeWidth={1.5} />
                            <span className="nav-tooltip">
                                Inicio
                            </span>
                        </NavLink>

                        {/* Experimentos */}
                        <NavLink 
                            to="/experimentos"
                            className={({ isActive }) => 
                                `botones p-2 self-center rounded-lg transition-colors ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                            }> 
                            <HugeiconsIcon icon={BookOpenTextFreeIcons} size={iconSize} color="#3b3fb6" strokeWidth={1.5} />
                            <span className="nav-tooltip">
                                Experimentos
                            </span>
                        </NavLink>

                        {/* Inventario */}
                        <NavLink 
                            to="/inventario"
                            className={({ isActive }) => 
                                `botones p-2 self-center rounded-lg transition-colors ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                            }> 
                            <HugeiconsIcon icon={PackageIcon} size={iconSize} color="#3b3fb6" strokeWidth={1.5} />
                            <span className="nav-tooltip">
                                Invetario
                            </span>
                        </NavLink>

                        {/* Recetario */}
                        <NavLink
                            to="/recetario"
                            className={({ isActive }) => 
                                `botones p-2 self-center rounded-lg transition-colors ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                            }> 
                            <HugeiconsIcon icon={MushroomIcon} size={iconSize} color="#3b3fb6" strokeWidth={1.5} />
                            <span className="nav-tooltip">
                                Recetario
                            </span>
                        </NavLink>

                        {/* Lotes */}
                        <NavLink
                            to="/lotes"
                            className={({ isActive }) => 
                                `botones p-2 self-center rounded-lg transition-colors ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                            }> 
                            <HugeiconsIcon icon={NaturalFoodIcon} size={iconSize} color="#3b3fb6" strokeWidth={1.5} />
                            <span className="nav-tooltip">
                                Lotes
                            </span>
                        </NavLink>
                    </div>
                </nav> 
            </aside>

            {/* //! Outlet se encarga de renderizar la vista sin desaparecer la barra de navegacion */}
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}