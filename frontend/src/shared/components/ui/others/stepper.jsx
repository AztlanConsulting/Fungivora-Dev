import React, { useRef, useState, useEffect } from "react";
import { colores } from "../basics/Colores";
import Text from "../basics/Texto";

/**
* Stepper 
* Componente de selección de estado/paso en el que se encuentra el concepto
* Responsibo para el cambio de tamaño de pantalla, moviendo los textos
* de manera que sea legible en todo contexto.
* @param steps Lista de objetos 
* @param currentStep Indice del paso activo seleccionado
* @param onStepChange Callback para cambio de estado
* @param colorTheme "azul" | "verde", preestablecidos
* @param readOnly Si es true, el usuario no puede hacer click para cambiar de paso
*/
const Stepper = ({
    steps = [],
    currentStep = 0,
    onStepChange,
    colorTheme = "azul",
    readOnly = false // Controla si lo puedes clickear o no
}) => {
    const isVerde = colorTheme === "verde";
    const totalSteps = steps.length;
    const containerRef = useRef(null);
    const [shouldZigZag, setShouldZigZag] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver(([entry]) => {
            setShouldZigZag(entry.contentRect.width / totalSteps < 80);
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [totalSteps]);

    const mainColor = isVerde ? colores.verde : colores.azul; // Colores de pasos que ya pasaron
    const activeColor = isVerde ? colores.verdeOscuro : colores.azulOscuro; // Colores del paso seleccionado
    const inactiveColor = colores.grisMedio; // Color para circulo incativo
    const textColor = colores.gris;

    const handleStepClick = (index) => {
        if (!readOnly && onStepChange) {
            onStepChange(index);
        }
    };

    return (

        // Div para hacer un zig zag del texto por espacio reducido
        <div className={`w-full ${shouldZigZag ? "pt-14 pb-14" : "pt-10 pb-4"}`}>
            <div ref={containerRef} className="flex items-center justify-between w-full relative">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    const isReached = index <= currentStep;

                    const circleColor = isActive ? activeColor : (isCompleted ? mainColor : "#FFF");
                    const borderColor = isReached ? (isActive ? activeColor : mainColor) : inactiveColor;

                    const isEven = index % 2 === 0;

                    // Si hay más de 4 pasos, los impares bajan en móvil. Si no, todos estan arriba.
                    const labelGoesDown = shouldZigZag && !isEven;

                    // FIX posición vertical del label
                    const labelVertical = labelGoesDown
                        ? "top-[calc(100%+6px)]"
                        : "bottom-[calc(100%+6px)]";

                    // FIX alineación horizontal: primero ancla izquierda, último ancla derecha, resto centrado
                    const labelHorizontal = "left-1/2 -translate-x-1/2 text-center";

                    const CircleContainer = readOnly ? "div" : "button";

                    return (
                        <div key={index} className="flex flex-col items-center relative flex-1">

                            {/* Clase para poder tener los labels */}
                            <span
                                className={`absolute w-max max-w-[64px] leading-tight pointer-events-none ${labelVertical} ${labelHorizontal}`}
                                style={{
                                    color: textColor,
                                    fontWeight: isActive ? "700" : "400",
                                    fontSize: "clamp(10px, 3vw, 13px)",
                                    whiteSpace: "normal"
                                }}
                            >
                                {step.label}
                            </span>

                            {/* Círculos*/}
                            <CircleContainer
                                onClick={() => handleStepClick(index)}
                                className={`relative z-10 outline-none transition-all ${readOnly
                                    ? "cursor-default"
                                    : "cursor-pointer hover:scale-110 active:scale-95"
                                    }`}
                            >
                                <div
                                    className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 transition-all duration-500"
                                    style={{
                                        backgroundColor: circleColor,
                                        borderColor: borderColor,
                                    }}
                                />
                            </CircleContainer>

                            {/* Línea central */}
                            {index !== totalSteps - 1 && (
                                <div
                                    className="absolute h-[3px] transition-all duration-500"
                                    style={{
                                        top: "50%",
                                        left: "50%",
                                        right: "-50%",
                                        backgroundColor: isCompleted ? mainColor : inactiveColor,
                                        zIndex: 0,
                                        transform: "translateY(-50%)"
                                    }}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Stepper;