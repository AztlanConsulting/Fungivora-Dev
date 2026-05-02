// frontend/src/features/inoculos/components/seleccionar_especie.jsx
import React, { useEffect, useState } from "react";
import { colores } from "../../../shared/components/ui/basics/colores";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

const SelectEspecie = ({
  value,
  onChange,
  placeholder = "Selecciona una especie...",
  size = "normal",
}) => {
  const [especies, setEspecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const res = await fetch("/api/inoculos/especies");
        const json = await res.json();

        if (json.success) {
          setEspecies(json.data);
        } else {
          setError("No se pudieron cargar las especies");
        }
      } catch (err) {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    };

    fetchEspecies();
  }, []);

  const sizes = {
    normal: "w-80 md:w-96",
    amplio: "w-80 md:w-96",
    numero: "w-24 md:w-32",
  };

  // Color del texto: gris si no hay valor seleccionado, azul si hay valor
  const textColor = value ? colores.azul : colores.gris;

  const clase = `${sizes[size]} 
    border-2 
    rounded-xl 
    px-3 py-2 pr-8 
    text-sm
    outline-none cursor-pointer appearance-none 
    transition-colors focus:border-[#3b3fb6]`;

  return (
    <div className="relative w-fit">
      <select
        value={value}
        onChange={onChange}
        className={clase}
        style={{
          backgroundColor: "#F9FDFF",
          color: textColor,
          borderColor: colores.grisMedio,
        }}
        disabled={loading}
      >
        <option value="" disabled hidden>
          {loading ? "Cargando especies..." : error ? error : placeholder}
        </option>

        {especies.map((esp) => (
          <option key={esp.especie} value={esp.especie}>
            {esp.especie}
          </option>
        ))}
      </select>

      <span
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
        style={{ color: colores.azul }}
      >
        <HugeiconsIcon icon={ArrowDown01Icon} size={25} />
      </span>
    </div>
  );
};

export default SelectEspecie;