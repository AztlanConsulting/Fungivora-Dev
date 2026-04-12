import { NavLink, Outlet } from "react-router-dom";
import { HugeiconsIcon } from '@hugeicons/react';
import { Home07FreeIcons, BookOpenTextFreeIcons, PackageIcon, MushroomIcon, Notification01Icon, Logout02Icon, NaturalFoodIcon, } from '@hugeicons/core-free-icons';
import fungivora from "/icons/icon-512x512.png?url"
import '../styles/navbar.css'

export default function MainLayout () {
    return (
        <div className="layout">
            <aside>
                <nav className="barra-lateral">
                    <div className="logo-div"><img src={fungivora} className="fungivora" /> </div>
                        
                    <div className="contenedor-principal-nav">
                        <NavLink
                            to="/second"
                            className={({ isActive }) => 
                                `botones p-2 self-center rounded-lg transition-colors ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                            }>
                            <HugeiconsIcon icon={Home07FreeIcons} size={40} color="#3b3fb6" strokeWidth={1.5} />
                            <span className="nav-tooltip">
                                Inicio
                            </span>
                        </NavLink>

                        <NavLink 
                            to="/second"
                            className={({ isActive }) => 
                                `botones p-2 self-center rounded-lg transition-colors ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                            }> 
                            <HugeiconsIcon icon={BookOpenTextFreeIcons} size={40} color="#3b3fb6" strokeWidth={1.5} />
                            <span className="nav-tooltip">
                                Experimentos
                            </span>
                        </NavLink>

                        <NavLink 
                            to="/second"
                            className={({ isActive }) => 
                                `botones p-2 self-center rounded-lg transition-colors ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                            }> 
                            <HugeiconsIcon icon={PackageIcon} size={40} color="#3b3fb6" strokeWidth={1.5} />
                            <span className="nav-tooltip">
                                Invetario
                            </span>
                        </NavLink>

                        <NavLink
                            to="/second"
                            className={({ isActive }) => 
                                `botones p-2 self-center rounded-lg transition-colors ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                            }> 
                            <HugeiconsIcon icon={MushroomIcon} size={40} color="#3b3fb6" strokeWidth={1.5} />
                            <span className="nav-tooltip">
                                Recetario
                            </span>
                        </NavLink>

                        <NavLink
                            to="/second"
                            className={({ isActive }) => 
                                `botones p-2 self-center rounded-lg transition-colors ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                            }> 
                            <HugeiconsIcon icon={NaturalFoodIcon} size={40} color="#3b3fb6" strokeWidth={1.5} />
                            <span className="nav-tooltip">
                                Lotes
                            </span>
                        </NavLink>
                    </div>

                    <div className="contenedor-inferior-nav">
                        <NavLink 
                            to="/second"
                            className={({ isActive }) => 
                                `botones p-2 self-center rounded-lg transition-colors ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                            }>
                            <HugeiconsIcon icon={Notification01Icon} size={40} color="#3b3fb6" strokeWidth={1.5} />
                            <span className="nav-tooltip">
                                Notificaciones
                            </span>
                        </NavLink>

                        <button className="botones flex p-2 self-center rounded-lg transition-colors hover:bg-gray-100">
                            <HugeiconsIcon icon={Logout02Icon} size={40} color="#3b3fb6" strokeWidth={1.5} />
                            <span className="nav-tooltip">
                                Cerrar sesión
                            </span>
                        </button>
                    </div>
                </nav> 
            </aside>

            <main className="flex-1 bg-yellow-500">
                <Outlet />
            </main>
        </div>
    )
}