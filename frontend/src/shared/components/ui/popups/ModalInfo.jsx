import React from "react";
import Text from "../basics/Texto";
import { colores } from "../basics/Colores";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";

/**
 * Modal de sólo información (sin botones de acción).
 * Se cierra con la X o con click en el overlay.
 */
const ModalInfo = ({
  visible,
  mensaje = "",
  onClose,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[30px]
        p-9 w-full max-w-lg shadow-2xl
        flex flex-col items-center text-center
        gap-8 border border-gray-100 animate-in fade-in zoom-in duration-200">

        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: `${colores.gris}20` }}
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} color={colores.gris} />
        </button>

        <div
          className="w-40 h-40 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${colores.azul}20` }}
        >
          <HugeiconsIcon icon={InformationCircleIcon} size={75} color={colores.azul} />
        </div>

        <Text variante="body" style={{ color: colores.negro }}>
          {mensaje}
        </Text>
      </div>
    </div>
  );
};

export default ModalInfo;
