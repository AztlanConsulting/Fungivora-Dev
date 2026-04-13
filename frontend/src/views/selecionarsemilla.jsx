import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectCampo from "../componentes/selectcampo";
import Button from "../componentes/botones";

//! BORRAME SOY TEST :)
const semillas = [
  { value: "1", label: "Semilla A - Maíz Blanco", id_inventario: "i1-11111111-1111-1111-111111111111", nombre_inventario: "Semilla A - Maíz Blanco", unidad_medida: "kg" },
  { value: "2", label: "Semilla B - Trigo Suave",  id_inventario: "i2-22222222-2222-2222-222222222222", nombre_inventario: "Semilla B - Trigo Suave",  unidad_medida: "kg" },
  { value: "3", label: "Semilla C - Arroz Largo",  id_inventario: "i3-33333333-3333-3333-333333333333", nombre_inventario: "Semilla C - Arroz Largo",  unidad_medida: "kg" },
  { value: "4", label: "Semilla D - Sorgo Rojo",   id_inventario: "i4-44444444-4444-4444-444444444444", nombre_inventario: "Semilla D - Sorgo Rojo",   unidad_medida: "kg" },
];

const SeleccionarSemilla = () => {
  const navigate = useNavigate();
  const [seleccionada, setSeleccionada] = useState(null);

  const handleChange = (e) => {
    const opcion = semillas.find((s) => s.value === e.target.value);
    setSeleccionada(opcion || null);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF2] ml-[70px] px-8 py-6 font-sans">
      <div className="max-w-xs flex flex-col gap-4">
        <SelectCampo
          opciones={semillas}
          value={seleccionada?.value || ""}
          onChange={handleChange}
          placeholder="Selecciona una semilla..."
        />
        <Button
          variant="confirmar"
          onClick={() =>
            seleccionada &&
            navigate("/inventario/registrarsemilla", {
              state: { semilla: seleccionada },
            })
          }
          disabled={!seleccionada}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default SeleccionarSemilla;