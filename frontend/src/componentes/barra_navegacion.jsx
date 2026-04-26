import React from "react";
import { colores } from "./colores";
import Text from "./texto";
import { Home07FreeIcons, BookOpenTextFreeIcons, PackageIcon, MushroomIcon} from '@hugeicons/core-free-icons';
import fungivora from "/icons/icon-512x512.png?url"

const Contenedor_principal = `
    flex flex-row gap-2 p-2 justify-between items-center
    bg-blanco text-center w-full h-[4.5rem]
    fixed bottom-0 left-0 z-50

    md:flex-col md:w-20 md:h-screen md:text-left
    md:sticky md:top-0
`
const LogoDiv = `
  hidden 
  md:flex md:flex-col md:p-2
`;
/* Si algo truena de la imagen revisa aqui primero*/
const LogoImg = `
  hidden 
  md:block
`;

const Contenedor_iconos = `
    flex flex-1 flex-row gap-1 justify-evenly p2
    md:flex-col md-5 justify-center
`
const Tooltip = `
    absolute left-[4.5rem] p-2
    bg-azul text-blanco rounded-[0.875]
    white-space: nowrap

    opacity-0 pointer-events-none 
    transition-opacity duration-200
    md:group-hover:opacity-100
`

const Botones =`
    flex relative items-center justify-center
    p-2 self-center rounded-lg transition-colors
`

const Barra_navegacion = () => {
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
                        <HugeiconsIcon icon={Home07FreeIcons} size={iconSize} color="azul" strokeWidth={1.5} />
                        <span className={Tooltip}>
                            Inicio
                        </span>
                    </NavLink>

                    {/* Experimentos */}
                    <NavLink 
                        to="/experimentos"
                        className={({ isActive }) => 
                            `${Botones} ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                        }> 
                        <HugeiconsIcon icon={BookOpenTextFreeIcons} size={iconSize} color="azul" strokeWidth={1.5} />
                        <span className={Tooltip}>
                            Experimentos
                        </span>
                    </NavLink>

                    {/* Inventario */}
                    <NavLink 
                        to="/inventario"
                        className={({ isActive }) => 
                            `${Botones} ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                        }> 
                        <HugeiconsIcon icon={PackageIcon} size={iconSize} color="azul" strokeWidth={1.5} />
                        <span className={Tooltip}>
                            Inventario
                        </span>
                    </NavLink>

                    {/* Recetario */}
                    <NavLink
                        to="/recetario"
                        className={({ isActive }) => 
                            `${Botones} ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`
                        }> 
                        <HugeiconsIcon icon={MushroomIcon} size={iconSize} color="azul" strokeWidth={1.5} />
                        <span className={Tooltip}>
                            Recetario
                        </span>
                    </NavLink>
                </div>
            </nav>
        </aside>
    )
}