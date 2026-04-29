import React from "react";
import { colores } from "./colores";
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';

//Parametros a  usar dentro del componente
const SelectField = ({ 
  value, 
  onChange, 
  placeholder, 
  options = [], 
  size = "normal",
}) => {

  //Tamano del componente
  const sizes = {
    normal: "w-80 md:w-96",
    amplio: "w-80 md:w-96",
    numero: "w-24 md:w-32",
  };
    
  //Clase donde se diseña el componente usando Tailwind y otros componentes como colores
    //Se pidio ayuda a la IA para sacar los comandos de diseño de tawilwind
  const clase = `${sizes[size]} 
  border-2 border-["#686868"] 
  rounded-xl 
  px-3 py-2 pr-8 
  text-sm text-[${colores.azul}] 
  outline-none cursor-pointer appearance-none 
  transition-colors focus:border-[#3b3fb6]`;

  return (

    <div className="relative w-fit">
      {/*Parametros que el componente tendra del padre*/}
      <select
        value={value}
        onChange={onChange}
        className={clase}
        style={{ backgroundColor: "#F9FDFF" }}
      >

      {/*Opciones del seleccionar y como se seleccionara*/}
      

      <option value="" disabled hidden>{placeholder}</option>  
      {options.map((op) => (
        <option key={op.value} value={op.value}>
          {op.label}
        </option>
      ))}
      </select>

      <span className={`
        pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 
        text-[${colores.azul}]`}>
        <HugeiconsIcon icon={ArrowDown01Icon} size={25}></HugeiconsIcon></span>

    </div>

  );
};

export default SelectField;