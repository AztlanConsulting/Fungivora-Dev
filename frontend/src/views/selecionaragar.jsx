import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectCampo from "../componentes/selectcampo";
import Button from "../componentes/botones";

//! BORRAME SOY TEST :)
const agar = [
  { value: "1", label: "Agar A - Nutriente base",  id_inventario: "i1-11111111-1111-1111-111111111111", nombre_inventario: "Agar A - Nutriente base",  unidad_medida: "ml" },
  { value: "2", label: "Agar B - Papa Dextrosa",   id_inventario: "i2-22222222-2222-2222-222222222222", nombre_inventario: "Agar B - Papa Dextrosa",   unidad_medida: "ml" },
  { value: "3", label: "Agar C - Sabouraud",        id_inventario: "i3-33333333-3333-3333-333333333333", nombre_inventario: "Agar C - Sabouraud",        unidad_medida: "ml" },
  { value: "4", label: "Agar D - Malt Extract",     id_inventario: "i4-44444444-4444-4444-444444444444", nombre_inventario: "Agar D - Malt Extract",     unidad_medida: "ml" },
];

const SeleccionarAgar = () => {
  const navigate = useNavigate();
  const [seleccionado, setSeleccionado] = useState(null);

  const handleChange = (e) => {
    const opcion = agar.find((a) => a.value === e.target.value);
    setSeleccionado(opcion || null);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF2] ml-[70px] px-8 py-6 font-sans">
      <div className="max-w-xs flex flex-col gap-4">
        <SelectCampo
          opciones={agar}
          value={seleccionado?.value || ""}
          onChange={handleChange}
          placeholder="Selecciona un agar..."
        />
        <Button
          variant="confirmar"
          onClick={() =>
            seleccionado &&
            navigate("/inventario/registraragar", {
              state: { agar: seleccionado },
            })
          }
          disabled={!seleccionado}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default SeleccionarAgar;