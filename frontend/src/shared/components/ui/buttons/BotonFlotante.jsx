import React from 'react';
import  Text  from '../basics/Texto';
import  {colores}  from '../basics/Colores';

const BotonCrear = ({ onClick, texto = "Crear" }) => (
    <button
        onClick={onClick}
        aria-label={texto}
        className={`
            fixed bottom-20 right-10 md:bottom-10 md:right-16
            z-50 w-40 h-8 md:w-52 md:h-10 text-base md:text-lg
            rounded-full flex items-center justify-center shadow-lg
            transition-opacity hover:opacity-80 active:scale-95
        `}
        style={{
            backgroundColor: "#FFFFFF",
            border: `2px solid ${colores.azul}`
        }}
    >
        <Text variante='button' style={{ color: colores.azul }}>{texto}</Text>
    </button>
);

export default BotonCrear;