import React from "react";
import Text from "./texto";

/*
* Titulo
Componente de encabezado fijo en la parte superior de la pantalla.
Permanece visible durante el scroll y se utiliza como barra principal
para mostrar títulos de vista.

@param children Contenido del título
*/
const Titulo = ({ children }) => {
  return (
    <div className="
      fixed top-0 left-0 w-full md:left-20 z-50
      bg-[#FFFFFF]

      flex items-start
      px-8 py-6 md:px-12
    ">
      <div className="w-full">
        <Text variante="title">
          {children}
        </Text>
      </div>
    </div>
  );
};

export default Titulo;