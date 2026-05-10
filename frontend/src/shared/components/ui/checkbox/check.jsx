import React, { useState } from "react";
import { colores } from "../basics/colores";
import { HugeiconsIcon } from '@hugeicons/react';
import { SquareIcon, CheckmarkSquare02Icon } from '@hugeicons/core-free-icons';

/*
Componente reutilizable para renderizar un checkbox
con variantes y estados definidos.
Permite asignar variantes.
muestra una marca de correcto al seleccionarse

@param onChange Funcion que se ejecuta al cambiar el estado 
@param variant Tipo de checkbox
@param disabled Deshabilita la interacción
*/

const Checkbox = ({ isChecked = false, 
    onChange, 
    variant = "Basico", 
    disabled = false,
    }) => {

    const[isFocused, setIsFocused] = useState(false);

    const variants = {
        Basico: colores.azul,
        Obscuro: colores.azulClaro,
        exito: colores.verdeAccent
    };

    const mainColor = variants[variant] || colores.azul;

    const iconData = isChecked ? CheckmarkSquare02Icon: SquareIcon;


    return (
        <button
            type="button"
            onClick={() => !disabled && onChange?.(!isChecked)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            className={`
                flex items-center justify-center
                transition-all
                rounded-md outline-none
                ${!disabled ? "hover:opacity-80 active:scale-95" : "cursor-not-allowed"}
                
            `}
            style ={{
                boxShadow: isFocused ? `0 0 0 4px ${mainColor}40` : "none",
                width: "32px",
                height: "32px"
            }}
        >

        <HugeiconsIcon 
            icon={iconData} 
            size={42} 
            color={mainColor} 
            variant="stroke" 
        />

        </button>
    );
    };
export default Checkbox;
