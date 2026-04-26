import React from "react";
import { colores } from "./colores";
import Text from "./texto";

//Parametros a  usar dentro del componente
const SelectField = ({ label, value, onChange, placeholder, icon, options = []}, size = "normal") => {

//Tamano del componente
const sizes = {
  normal: "w-80 md:w-96",
  amplio: "w-80 md:w-96",
  numero: "w-24 md:w-32",
};
  
//Clase donde se diseña el componente usando Tailwind y otros componentes como colores
  //Se pidio ayuda a la IA para sacar los comandos de diseño de tawilwind
const clase = `${sizes[size]} border-2 border-[${colores.azul}] rounded-xl px-3 py-2 pr-8 text-sm text-[${colores.azul}] outline-none cursor-pointer appearance-none transition-colors focus:border-[#2e9e6b]`;

  return (

    //Creacion del contenedor para selecionar
    <div className="w-full mb-6 md:mb-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
           {icon && <span className="flex items-center">{icon}</span>} 
           <Text variante="label" as="label">{label}</Text>
      </div>

      {/*Parametros que el componente tendra del padre*/}
      <select
        value={value}
        onChange={onChange}
        className={clase}
        style={{ backgroundColor: "white" }}
    >

    {/*Opciones del seleccionar y como se seleccionara*/}
    <option value="" disabled>{placeholder}</option>

    {options.map((op) => (
      <option key={op.value} value={op.value}>
       <Text variante="option">{op.label}</Text>
      </option>
    ))}
    </select>
</div>
</div>

  );
};

export default SelectField;