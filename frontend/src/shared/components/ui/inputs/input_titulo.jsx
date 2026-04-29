import React from "react";
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';

const VALID_CHARS = /[^A-Za-z0-9."/_+,:;()ñÑáéíóúÁÉÍÓÚ\s]/g;

const sanitize = (text) => text.replace(VALID_CHARS, "");

const CampoTexto = ({ 
  texto_titulo = "", 
  id_campo, 
  nombre_campo = "",
  atributo, 
  onChange, 
  texto_relleno = "Escribe tu entrada...", 
  multiline = false,
  tipo = "text",
  esSelect = false,
  opciones = []
}) => {
  const clase = "w-full border-2 border-[#3b3fb6] rounded-xl px-3 py-2 text-sm text-[#3b3fb6] bg-[#F9FDFF] outline-none placeholder-[#a0a8d9] placeholder:italic focus:border-[#ffb81c] appearance-none";
// Para que solaente acepte texto se hizo full con IA
  // Crea un onChange sanitizado que envuelve el original
  const handleChange = (e) => {
    if (tipo === "text") {
      const cleaned = sanitize(e.target.value);
      // Mutamos el evento para que el padre reciba el valor limpio
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: cleaned, name: e.target.name },
      };
      onChange(syntheticEvent);
    } else {
      onChange(e);
    }
  };

  const handlePaste = (e) => {
    if (tipo !== "text") return;
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const cleaned = sanitize(pasted);
    const { selectionStart, selectionEnd } = e.target;
    const newValue =
      atributo.slice(0, selectionStart) + cleaned + atributo.slice(selectionEnd);
    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: newValue, name: e.target.name },
    };
    onChange(syntheticEvent);
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-black text-base md:text-3xl">{texto_titulo}</label>

      {esSelect ? (
        <div className="relative">
          <select
            name={id_campo}
            className={clase}
            value={atributo}
            onChange={onChange}
            required
          >
            {opciones.map((opt, index) => (
              <option
                key={opt[id_campo] || index}
                value={opt[id_campo]}
              >
                {opt[nombre_campo]}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#3b3fb6]">
            <HugeiconsIcon 
              icon={ArrowDown01Icon}
              size={20}
              variant="stroke"
              strokeWidth={3}
            />      
          </div>
        </div>
      ) : multiline ? (
        <textarea
          name={id_campo}
          className={`${clase} resize-none h-20`}
          placeholder={texto_relleno}
          value={atributo}
          onChange={handleChange}
          onPaste={handlePaste}
        />
      ) : (
        <input
          name={id_campo}
          type={tipo}
          className={clase}
          placeholder={texto_relleno}
          value={atributo}
          onChange={handleChange}
          onPaste={handlePaste}
          required
        />
      )}
    </div>
  );
};

export default CampoTexto;