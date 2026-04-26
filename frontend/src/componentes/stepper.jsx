import React from "react";
import { colores } from "./colores";
import Text from "./texto";

/**
* Stepper 
* Componente de selección de estado/paso en el que se encuentra el concepto
* Responsibo para el cambio de tamaño de pantalla, moviendo los textos
* de manera que sea legible en todo contexto.
* @param steps Lista de objetos 
* @param currentStep Indice del paso activo seleccionado
* @param onStepChange Callback para cambio de estado
* @param colorTheme "azul" | "verde", preestablecidos
*/
const Stepper = ({ 
    steps = [], 
    currentStep = 0, 
    onStepChange, 
    colorTheme = "azul" 
}) => {
    const isVerde = colorTheme === "verde";
    const totalSteps = steps.length;
    const shouldZigZag = totalSteps > 4; //Cambia el orden de los labels si el espacio es reducido
    
    const mainColor = isVerde ? colores.verde : colores.azul; // Colores de pasos que ya pasaron
    const activeColor = isVerde ? colores.verdeOscuro : colores.azulOscuro; // Colores del paso seleccionado
    const inactiveColor = colores.gris; // Color para circulo incativo
    const textColor = colores.gris; 

    const handleStepClick = (index) => {
        if (onStepChange) onStepChange(index);
    };

    return (
        // Div para hacer un zig zag del texto por espacio reducido
        <div className={`w-full pt-12 ${shouldZigZag ? "pb-12 md:pb-4" : "pb-4"}`}>
            <div className="flex items-center justify-between w-full relative">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    const isReached = index <= currentStep;
                    
                    const circleColor = isActive ? activeColor : (isCompleted ? mainColor : "#FFF");
                    const borderColor = isReached ? (isActive ? activeColor : mainColor) : inactiveColor;
                    const isEven = index % 2 === 0;

                    // Si hay más de  4 pasos, los impares bajan en móvil. Si no, todos estan arriba.
                    const labelPosition = (shouldZigZag && !isEven) 
                        ? "top-9 md:-top-9" 
                        : "-top-9";

                    return (
                        <div key={index} className="flex flex-col items-center relative flex-1">
                            
                            {/* Clase para poder tener los labels */}
                            <div className={`absolute w-full text-center px-1 transition-all duration-300 ${labelPosition}`}>
                                <Text variante="input">
                                    <span 
                                        className="block leading-tight"
                                        style={{ 
                                            color: textColor,
                                            fontWeight: isActive ? "700" : "400",
                                            fontSize: "clamp(12px, 1.5vw, 16px)",
                                            whiteSpace: "normal" 
                                        }}
                                    >
                                        {step.label}
                                    </span>
                                </Text>
                            </div>

                            {/* Círculos */}
                            <button
                                onClick={() => handleStepClick(index)}
                                className="relative z-10 transition-transform hover:scale-110 active:scale-95 outline-none"
                            >
                                <div 
                                    className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 transition-all duration-500 flex items-center justify-center"
                                    style={{ 
                                        backgroundColor: circleColor,
                                        borderColor: borderColor,
                                    }}
                                />
                            </button>

                            {/* Línea central */}
                            {index !== steps.length - 1 && (
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