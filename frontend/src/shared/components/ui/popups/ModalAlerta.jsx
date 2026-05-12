import React, { useEffect, useState } from "react";
import { colores } from "../basics/colores";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    CheckmarkCircle02Icon,
    Alert02Icon,
    Cancel01Icon,
    MultiplicationSignCircleIcon,
} from "@hugeicons/core-free-icons";

const VARIANTES = {
    exito: {
        icon: CheckmarkCircle02Icon,
        color: "#22c55e",         // verde
        bg: "#f0fdf4",
        border: "#bbf7d0",
        label: "Éxito",
    },
    error: {
        icon: MultiplicationSignCircleIcon,
        color: "#ef4444",         // rojo
        bg: "#fef2f2",
        border: "#fecaca",
        label: "Error",
    },
    advertencia: {
        icon: Alert02Icon,
        color: "#f59e0b",         // amarillo
        bg: "#fffbeb",
        border: "#fde68a",
        label: "Advertencia",
    },
};

const AUTO_DISMISS_MS = 4000; // 4 segundos

/**
 * ModalAlerta
 *
 * @param {boolean} visible - Controla la visibilidad del modal.
 * @param {"exito" | "error" | "advertencia"} variante - Tipo de alerta para estilos e ícono.
 * @param {string} mensaje - Texto a mostrar en la alerta.
 * @param {function} onClose - Función callback al cerrar la alerta.
 */
const ModalAlerta = ({
    visible,
    variante = "exito",
    mensaje = "",
    onClose,
}) => {
    const [saliendo, setSaliendo] = useState(false);

    const config = VARIANTES[variante] ?? VARIANTES.exito;

    // Auto-dismiss
    useEffect(() => {
        if (!visible) {
            setSaliendo(false);
            return;
        }

        const timerSalida = setTimeout(() => setSaliendo(true), AUTO_DISMISS_MS);
        const timerClose = setTimeout(() => {
            onClose?.();
        }, AUTO_DISMISS_MS + 300); // espera que termine la animación de salida

        return () => {
            clearTimeout(timerSalida);
            clearTimeout(timerClose);
        };
    }, [visible]);

    const handleClose = () => {
        setSaliendo(true);
        setTimeout(() => onClose?.(), 300);
    };

    if (!visible) return null;

    return (
        <div
            className="fixed bottom-8 left-1/2 z-[200]"
            style={{
                transform: "translateX(-50%)",
                animation: saliendo
                    ? "alertaSalida 0.3s ease-in forwards"
                    : "alertaEntrada 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
        >
            <style>{`
        @keyframes alertaEntrada {
          from { opacity: 0; transform: translateX(-50%) translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1);    }
        }
        @keyframes alertaSalida {
          from { opacity: 1; transform: translateX(-50%) translateY(0)    scale(1);    }
          to   { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.97); }
        }
      `}</style>

            <div
                className="flex items-center gap-3 px-5 py-3 rounded-full shadow-lg"
                style={{
                    backgroundColor: config.bg,
                    border: `1.5px solid ${config.border}`,
                    minWidth: "260px",
                    maxWidth: "420px",
                }}
            >
                {/* Ícono de variante */}
                <HugeiconsIcon icon={config.icon} size={22} color={config.color} />

                {/* Mensaje */}
                <span
                    className="flex-1 text-sm font-medium leading-snug"
                    style={{ color: "#1e293b" }}
                >
                    {mensaje}
                </span>

                {/* Botón X */}
                <button
                    onClick={handleClose}
                    className="flex items-center justify-center w-6 h-6 rounded-full transition-transform hover:scale-110 active:scale-95 flex-shrink-0"
                    style={{ backgroundColor: `${config.color}18` }}
                    aria-label="Cerrar"
                >
                    <HugeiconsIcon icon={Cancel01Icon} size={13} color={config.color} />
                </button>
            </div>
        </div>
    );
};

export default ModalAlerta;