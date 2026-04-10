import { Outlet } from "react-router-dom";

export default function MainLayout () {
    return (
        <div className="flex flex-col-reverse md:flex-row min-h-screen">
            <aside>
                <nav className="bg-red-600 text-center w-full h-16 md:text-left md:w-16 md:h-screen">
                    <ul>
                        <li> Queso </li>
                        <li> Quesadilla</li>
                    </ul>
                </nav> 
            </aside>
            <main className="flex-1 bg-yellow-500">
                <Outlet />
            </main>
        </div>
    )
}