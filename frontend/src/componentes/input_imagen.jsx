import React, { useState, useRef } from "react";
import { colores } from "./colores";
import { HugeiconsIcon } from '@hugeicons/react';
import { ImageAdd02Icon, Cancel01Icon } from '@hugeicons/core-free-icons';

// Configuración estática

/** Tipos de archivo permitidos */
const aceptar = "image/jpeg, image/png"

/** Mapa de tipo -> Label */
const tipoLabel = {
    "image/jpeg": "JPG",
    "image/png": "PNG",
};

/** Convierte bytes a texto legible */
const formatearPeso = (bytes) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

// Componente

/**
 * InputImagen — campo de selección de imagen reutilizable.
 *
 * Controlado con `value` / `onChange`, igual que el componente `Input`.
 * - Sin archivo  → muestra ícono, clic abre el file picker nativo.
 * - Con archivo  → muestra nombre, tipo (JPG/PNG) y peso; botón para quitar.
 *
 * @param {File|null} value    - Archivo seleccionado o null
 * @param {Function}  onChange - Recibe el File seleccionado o null al limpiar
 */

const InputImagen = ({
    value = null,
    onChange,
}) => {
    const inputRef = useRef(null);
    const [isFocused, setIsFocused] = useState(false);

    // Handlers

    /** Abre el picker, solo si no hay archivo*/
    const handleClick = () => {
        inputRef.current?.click();
    };

    /** Subir el archivo a value y verificar si es válido */
    const handleFileChange = (e) => {
        const archivo = e.target.files?.[0] ?? null;

        if (archivo && !aceptar.split(", ").includes(archivo.type)) {
            console.warn("Tipo de archivo no permitido");
            e.target.value = "";
            return;
        }

        if (archivo) onChange(archivo);
        e.target.value = "";
    };

    /** Limpia la selección */
    const handleQuitar = (e) => {
        e.stopPropagation();
        onChange(null);
    };

    // Estilos dinámicos
    const ringColor = isFocused ? colores.verde : colores.azul;
    const ringWidth = isFocused ? "ring-4" : "ring-2";

    // Render
    return (
        <div
            onClick={handleClick}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    setIsFocused(false);
                }
            }}
            tabIndex={0}
            role="button"
            aria-label={value ? `Imagen seleccionada: ${value.name}` : "Seleccionar imagen"}
            className={`
                w-80 h-10 md:w-96 md:h-10
                rounded-md overflow-hidden transition-all relative
                bg-[#F9FDFF] px-3
                flex items-center
                ${value ? "cursor-default" : "cursor-pointer"}
                ${ringWidth} ring-[var(--input-ring)]
                focus:outline-none
            `}
            style={{ "--input-ring": ringColor }}
        >
            {/** Input nativo oculto */}
            <input
                ref={inputRef}
                type="file"
                accept={aceptar}
                onChange={handleFileChange}
                className="hidden"
                tabIndex={-1}
                aria-hidden="true"
            />

            {value ? (
                // Estado: con archivo
                <div className="flex items-center justify-between w-full gap-2">
                    {/** Nombre del archivo */}
                    <span
                        className="truncate flex-1 min-w-0"
                        style={{
                            fontFamily: "Montserrat, sans-serif",
                            fontSize: "clamp(13px, 1.2vw, 16px)",
                            color: "#000",
                        }}
                    >
                        {value.name}
                    </span>

                    {/** Tipo y Peso */}
                    <div className="flex items-center gap-2 shrink-0">
                        <span
                            style={{
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: "clamp(11px, 1vw, 13px)",
                                color: colores.azul,
                                fontWeight: 600,
                            }}
                        >
                            {tipoLabel[value.type] ?? value.type}
                        </span>
                        <span
                            style={{
                                fontFamily: "Montserrat, sans-serif",
                                fontSize: "clamp(11px, 1vw, 13px)",
                                color: "#888",
                            }}
                        >
                            {formatearPeso(value.size)}
                        </span>

                        {/* Botón quitar */}
                        <button
                            onClick={handleQuitar}
                            aria-label="Quitar imagen"
                            className={`
                                flex items-center justify-center rounded-full
                                w-5 h-5 text-gray-400 hover:text-red-600
                                hover:bg-red-100 transition-colors
                            `}
                        >
                            <HugeiconsIcon icon={Cancel01Icon} size={14} color="currentColor" />
                        </button>
                    </div>
                </div>
            ) : (
                // Estado vacío
                <div className="flex items-center justify-center w-full gap-2"
                    style={{ color: colores.azul }}
                >
                    <HugeiconsIcon icon={ImageAdd02Icon} size={24} color="currentColor" />
                </div>
            )}
        </div>
    )
};

export default InputImagen;