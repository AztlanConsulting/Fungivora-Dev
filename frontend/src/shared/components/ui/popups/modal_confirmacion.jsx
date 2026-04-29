import React from "react";
import Button from "../buttons/botones";
import Text from "../basics/texto";
import { colores } from "../basics/colores";

import { HugeiconsIcon } from '@hugeicons/react';
/* Esta importación devuelve un array, por eso fallaba al usarlo como componente directo */
import { Cancel01Icon } from '@hugeicons/core-free-icons';

const ModalConfirmacion = ({
  visible,
  titulo = "¿Estás segurx?",
  descripcion = "Esta acción no se puede deshacer.",
  onConfirm,
  onCancel,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  icon: Icon,
}) => {
  if (!visible) return null;

  return (
    /* Overlay: Cubre toda la pantalla, oscurece el fondo y centra el contenido */
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

      {/* Fondo oscuro con desenfoque */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Caja del Modal */}
      <div className="relative bg-white rounded-[30px] 
      p-9 w-full max-w-lg shadow-2xl 
      flex flex-col items-center text-center 
      gap-8 border border-gray-100 animate-in fade-in zoom-in duration-200">

        {/* ICONO DE X (SALIDA)*/}
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: `${colores.gris}20` }}
        >
          {/* Solución: Usar HugeiconsIcon para procesar el array del icono de cierre */}
          <HugeiconsIcon icon={Cancel01Icon} size={20} color={colores.gris} />
        </button>

        {/* Círculo con Icono */}
        {Icon && (
          <div
            className="w-40 h-40 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colores.azul}20` }}
          >
            {typeof Icon === 'function' ? (
              <Icon size={60} color={colores.azul} />
            ) : (
              <HugeiconsIcon icon={Icon} size={75} color={colores.azul} />
            )}
          </div>
        )}

        {/* Textos */}
        <div className="flex flex-col gap-2">
          <Text variante="popup" style={{ color: colores.azul }}>
            {titulo}
          </Text>

          <Text variante="body">
            {descripcion}
          </Text>
        </div>

        <div className="w-full h-[1.8px] bg-gray-200 rounded-full"></div>

        {/* Botones */}
        <div className="flex flex-row md:flex-row gap-6 w-full justify-center">
          <Button variant="confirmar" isOutline={true} onClick={onConfirm}>
            {textoConfirmar}
          </Button>

          <Button variant="cancelar" isOutline={true} onClick={onCancel}>
            {textoCancelar}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;