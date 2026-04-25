import React from "react";
import { colores } from "./colores";
import Text from "./texto";
import { Home07FreeIcons, BookOpenTextFreeIcons, PackageIcon, MushroomIcon} from '@hugeicons/core-free-icons';
import fungivora from "/icons/icon-512x512.png?url"

const barra_navegacion = () => {
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
        <aside>
            <nav>
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
                            Inventario
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
                </div>
            </nav>
        </aside>
    )
}