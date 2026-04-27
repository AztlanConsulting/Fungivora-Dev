import React, { useState } from "react";
import { colores } from "./colores";
import Text from "./texto";

// Estilos y configuración estática

/** Tipografía compartida para el texto escrito dentro del input */
const inputTextStyle = {
    fontFamily: "Montserrat, sans-serif",
    fontSize: "clamp(16px, 1.5vw, 20px)",
    color: "#000"
};

/** Clases de tamaño según variante */
const sizes = {
    normal: "w-80 h-7 md:w-96 md:h-10",
    amplio: "w-80 h-16 md:w-96 md:h-24",
    numero: "w-24 h-7 md:w-32 md:h-10",
}

/** Alineación interna del placeholder según variante */
const alignments = {
    normal: "flex items-center",
    amplio: "py-2",
    numero: "flex items-center",
}

// Configuración para variante numérica

/**
 * Atributos HTML que activan el teclado numérico correcto en móvil.
 * Se pasan directamente al <input>.
 */
const numeroConfig = {
    entero: { type: "text", inputMode: "numeric", pattern: "[0-9]*" },
    decimal: { type: "text", inputMode: "decimal", pattern: "[0-9]*[.,]?[0-9]{0,2}" },
}

/** Regex que valida el valor completo al escribir */
const numeroRegex = {
    entero: /^\d*$/,
    decimal: /^\d*[.,]?\d{0,2}$/,
};

/** Caracteres que pueden romper el formato */
const caracteresBase = ["<", ">", "{", "}", "[", "]", "\\", "`", "^", "~"];

/**
 * Input — campo de texto reutilizable con soporte para:
 *  - Texto de una línea            (variante "normal")
 *  - Textarea multilínea           (variante "amplio")
 *  - Número entero sin negativo    (variante "numero", numeroTipo "entero")
 *  - Número decimal sin negativo   (variante "numero", numeroTipo "decimal")
 *
 * El ring de foco cambia de azul → verde para retroalimentación visual.
 * El placeholder usa el componente <Text> para mantener consistencia tipográfica.
 *
 * @param {string}   variante    - "normal" | "amplio" | "numero"
 * @param {string}   numeroTipo  - "entero" | "decimal" (solo aplica si variante === "numero")
 * @param {string}   placeholder - Texto de ayuda
 * @param {string}   value       - Valor controlado
 * @param {Function} onChange    - Handler de cambio del input
 */

const Input = ({
    variante = "normal",
    numeroTipo = "entero",
    placeholder = "",
    value,
    onChange,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    // Clases de tamaño y alineación según variante
    const sizeClass = sizes[variante] || sizes.normal;
    const alignmentClass = alignments[variante] || alignments.normal;

    // Handlers y validación

    /** Bloquea teclas no permitidas antes de que modifiquen el input. */
    const handleKeyDown = (e) => {
        const bloqueados = caracteresBase;
        if (bloqueados.includes(e.key)) e.preventDefault();
    };

    /**
     * Para inputs numéricos, valida el valor completo con regex
     * antes de propagar el cambio — evita estados inválidos.
     */
    const handleChange = (e) => {
        if (variante === "numero") {
            const regex = numeroRegex[numeroTipo] || numeroRegex.entero;
            if (!regex.test(e.target.value)) return;
        }
        onChange(e);
    };

    // Props compartidos entre <input> y <textarea>

    const sharedProps = {
        value,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
        // Elimina el spinner nativo de inputs numéricos en Chrome/Safari y da el estilo inicial
        className: `
            w-full h-full px-3 py-2 bg-[#F9FDFF] outline-none resize-none
            [appearance:textfield]
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
        `,
        style: inputTextStyle,
    };

    // Props extra para activar el teclado numérico correcto en móvil
    const numProps
        = variante === "numero"
            ? numeroConfig[numeroTipo] || numeroConfig.entero
            : { type: "text" };


    // Render

    return (
        <div
            className={`
                ${sizeClass} rounded-md overflow-hidden transition-all relative
                ${isFocused ? "ring-4" : "ring-2"} ring-[var(--input-ring)]
            `}
            style={{ "--input-ring": isFocused ? colores.verde : colores.azul }}
        >
            {/** Placeholder visual que usa Text para coincidir con el diseño*/}
            {!value && (
                <div className={`
                    absolute inset-0 px-3 pointer-events-none ${alignmentClass}
                `}>
                    <Text variante="input">{placeholder}</Text>
                </div>
            )}

            {/** Renderiza un <textarea> para la variante "amplio" y un <input> para las demás */}
            {variante === "amplio" ? (
                <textarea {...sharedProps} />
            ) : (
                <input {...sharedProps} {...numProps} />
            )}
        </div>
    );
};

export default Input;