import { Outlet } from "react-router-dom";
import { HugeiconsIcon } from '@hugeicons/react';
import { Home07FreeIcons, BookOpenTextFreeIcons, PackageIcon, MushroomIcon, Notification01Icon, Logout02Icon, NaturalFoodIcon, } from '@hugeicons/core-free-icons';
import fungivora from "../../public/icons/icon-512x512.png?url"

export default function MainLayout () {
    return (
        <div className="flex flex-col-reverse md:flex-row min-h-screen">
            <aside>
                <nav className="flex flex-row gap-2 p-2 justify-between bg-FFFFFF text-center w-full h-18 md:flex-col md:w-20 md:h-screen">
                    <button className="flex flex-row md:flex-col p-2"><img src={fungivora} className="w-12 h-12" /> </button>
                        
                    <div className="flex flex-1 flex-row md:flex-col gap-10 justify-center p-2">
                        <button> <HugeiconsIcon icon={Home07FreeIcons} size={40} color="#3b3fb6" strokeWidth={1.5} /> </button>
                        <button> <HugeiconsIcon icon={BookOpenTextFreeIcons} size={40} color="#3b3fb6" strokeWidth={1.5} /> </button>
                        <button> <HugeiconsIcon icon={PackageIcon} size={40} color="#3b3fb6" strokeWidth={1.5} /> </button>
                        <button> <HugeiconsIcon icon={MushroomIcon} size={40} color="#3b3fb6" strokeWidth={1.5} /> </button>
                        <button> <HugeiconsIcon icon={NaturalFoodIcon} size={40} color="#3b3fb6" strokeWidth={1.5} /> </button>
                    </div>

                    <div className="flex flex-row md:flex-col gap-10 p-2">
                        <button> <HugeiconsIcon icon={Notification01Icon} size={40} color="#3b3fb6" strokeWidth={1.5} /></button>
                        <button> <HugeiconsIcon icon={Logout02Icon} size={40} color="#3b3fb6" strokeWidth={1.5} /> </button>
                    </div>
                </nav> 
            </aside>
            <main className="flex-1 bg-yellow-500">
                <Outlet />
            </main>
        </div>
    )
}