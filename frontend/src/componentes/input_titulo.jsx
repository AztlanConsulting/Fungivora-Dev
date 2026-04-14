import React from "react";

const CampoTexto = ({ 
  texto_titulo = "", 
  id_campo, 
  nombre_campo="", //Solo sirve para selección múltiple, es el nombre que se muestra en el select
  atributo, 
  onChange, 
  texto_relleno = "Escribe tu entrada...", 
  multiline = false,
  tipo = "text",
  esSelect = false, // <-- Nueva prop para saber si es un combo
  opciones = []     // <-- Lista de opciones [{id, nombre}]
}) => {
  const clase = "w-full border-2 border-[#3b3fb6] rounded-xl px-3 py-2 text-sm text-[#3b3fb6] bg-white outline-none placeholder-[#a0a8d9] placeholder:italic focus:border-[#ffb81c] appearance-none";

  return (
    <div className="flex flex-col gap-1">
      <label className="text-black  text-base md:text-3xl">{texto_titulo}</label>
      
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
          {/* Flechita decorativa para el select */}
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#3b3fb6]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      ) : multiline ? (
        <textarea
          name={id_campo}
          className={`${clase} resize-none h-20`} 
          placeholder={texto_relleno}
          value={atributo}
          onChange={onChange}
        />
      ) : (
        <input
          name={id_campo}
          type={tipo}
          className={clase}
          placeholder={texto_relleno}
          value={atributo}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default CampoTexto;