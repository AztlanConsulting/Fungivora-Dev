import React from "react";

/*
* Base
Contenedor principal de layout que organiza el contenido de la vista.
Aplica padding general, centrado y control de márgenes superior e inferior.

@param children Contenido interno de la vista
@param margen_arriba Margen superior
@param margen_abajo Margen inferior del contenido
*/
const Base = ({ 
    children,
    margen_arriba = "mt-8 md:mt-12",
    margen_abajo = "mb-16",
 }) => {
    return (
        <div className={`flex flex-col p-4  md:p-16 bg-[#FAFAFE] min-h-screen items-center`}>
            <div className={`w-full flex flex-col ${margen_arriba} ${margen_abajo} `}>
                {children}
            </div>
        </div>
    );
};

export default Base;