import { NavLink, Outlet } from "react-router-dom";
import { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Home07FreeIcons, BookOpenTextFreeIcons, PackageIcon, MushroomIcon, Notification01Icon, Logout02Icon, NaturalFoodIcon, } from '@hugeicons/core-free-icons';
import fungivora from "/icons/icon-512x512.png?url"
import '../styles/navbar.css'

export default function MainLayout () {
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
                    <div className="logo-div"><img src={fungivora} className="fungivora" /> </div>
                        
                    <div className="contenedor-principal-nav">
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

                        <NavLink 
                            to="/first"
                            className={({ isActive }) => 
                                `botones p-2 self-center rounded-lg transition-colors ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                            }> 
                            <HugeiconsIcon icon={BookOpenTextFreeIcons} size={iconSize} color="#3b3fb6" strokeWidth={1.5} />
                            <span className="nav-tooltip">
                                Experimentos
                            </span>
                        </NavLink>

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

                        <NavLink
                            to="/first"
                            className={({ isActive }) => 
                                `botones p-2 self-center rounded-lg transition-colors ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                            }> 
                            <HugeiconsIcon icon={MushroomIcon} size={iconSize} color="#3b3fb6" strokeWidth={1.5} />
                            <span className="nav-tooltip">
                                Recetario
                            </span>
                        </NavLink>

                        <NavLink
                            to="/first"
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

            <main className="flex-1 bg-yellow-500">
                <Outlet />
            </main>
        </div>
    )
}