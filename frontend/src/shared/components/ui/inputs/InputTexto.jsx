import React, { useState, useRef, useEffect } from "react";
import { colores } from "../basics/Colores";
import Text from "../basics/Texto";

const inputTextStyle = {
    fontSize: "clamp(16px, 1.5vw, 14px)",
    color: colores.gris
};

const sizes = {
    normal: "w-full h-10 md:max-w-[24rem] md:h-12",
    amplio: "w-full h-auto min-h-[4rem] md:max-w-[24rem] md:min-h-[6rem]",
    numero: "w-full h-10 md:h-12",
};

const alignments = {
    normal: "flex items-center",
    amplio: "py-2",
    numero: "flex items-center",
};

const numeroConfig = {
    entero: { type: "text", inputMode: "numeric", pattern: "[0-9]*" },
    decimal: { type: "text", inputMode: "decimal", pattern: "[0-9]*([\\.][0-9]{0,2})?" },
};

const numeroRegex = {
    entero: /^\d*$/,
    decimal: /^\d*[.]?\d{0,2}$/,
};

const caracteresBase = ["<", ">", "{", "}", "[", "]", "\\", "`", "^", "~", ","]; 

const emailConfig = { type: "email" };

const Input = ({
    variante = "normal",
    numeroTipo = "entero",
    placeholder = "",
    placeholderLeft = "left-4",
    value,
    onChange,
    maxLength,
    className = "",
    type = "text", 
    roundedClass = "rounded-md",
    regex = null, 
    ...props 
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const textAreaRef = useRef(null);
    const tieneAnchoCustom = /\bw-\d+|\bw-auto|\bw-full\b/.test(className);
    const sizeClass = tieneAnchoCustom ? "" : (sizes[variante] || sizes.normal);
    const alignmentClass = alignments[variante] || alignments.normal;

    if (variante === "normal" && !regex && type !== "email") {
        regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9 ]*$/;
    }

    useEffect(() => {
        if (variante === "amplio" && textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [value, variante]);

    const handleKeyDown = (e) => {
        if (type === "password" || type === "text2") {
            return; 
        }
        if (caracteresBase.includes(e.key)) {
            e.preventDefault();
        }
    };

    const handleChange = (e) => {
        if (!onChange) return;

        if (variante === "numero") {
            const rawValue = e.target.value;
            const numeroRgx = numeroRegex[numeroTipo] || numeroRegex.entero;
            if (!numeroRgx.test(rawValue)) return;
            return onChange(e);
        }

        if (type === "password" || type === "text2") {
            onChange(e);
            return;
        }

        let regexFinal = regex;
    
        if (!regexFinal) {
            if (type === "email") {
                regexFinal = /^[a-zA-Z0-9@.\-_]*$/; 
            } else if (variante === "normal") {
                regexFinal = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9 ]*$/;
            } else if (variante === "search") {
                regexFinal = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ0-9 -]*$/;
            }
        }
        if (regexFinal && !regexFinal.test(e.target.value)) return;

        onChange(e);
    };
    const sharedProps = {
        value,
        onChange: handleChange,
        onKeyDown: handleKeyDown,
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
        className: `
            flex-1 h-full px-4 py-2 bg-transparent outline-none resize-none relative z-10
            [appearance:textfield]
            disabled:bg-transparent disabled:cursor-not-allowed
            [&::-webkit-outer-spin-button]:appearance-none
            [&::-webkit-inner-spin-button]:appearance-none
            ${variante === "amplio" ? "overflow-hidden" : ""}
            ${className} 
        `,
        style: inputTextStyle,
        ...props 
    };

    const numProps = variante === "numero"
        ? numeroConfig[numeroTipo] || numeroConfig.entero
        : (type === "email" ? emailConfig : { type: type });

    return (
        <div
            className={`
                bg-white transition-all relative flex items-center
                ${sizeClass} ${roundedClass} overflow-hidden
                ${isFocused ? "ring-4" : "ring-2"} ring-[var(--input-ring)]
            `}
            style={{ "--input-ring": isFocused ? colores.azul : colores.grisClaro }}
        >
            {!value && (
                <div className={`absolute ${placeholderLeft || 'left-4'} inset-y-0 pointer-events-none z-0 ${alignmentClass}`}>
                    <Text variante="input">{placeholder}</Text>
                </div>
            )}

            {variante === "amplio" ? (
                <textarea 
                    ref={textAreaRef} 
                    rows={1} 
                    placeholder={placeholder}
                    {...sharedProps} 
                    className={`${sharedProps.className} placeholder-transparent`} 
                />
            ) : (
                <input 
                    {...sharedProps} 
                    {...numProps}
                    placeholder={placeholder}
                    className={`${sharedProps.className} placeholder-transparent`} 
                    maxLength={maxLength || (variante === "normal" ? 50 : variante === "numero" ? 8 : undefined)}
                />
            )}
        </div>
    );
};

export default Input;