import React from "react";
import Text from "../../../shared/components/ui/basics/Texto";
import Input from "../../../shared/components/ui/inputs/InputTexto";
import SelectField from "../../../shared/components/ui/inputs/SeleccionarTexto";
import Button from "../../../shared/components/ui/buttons/Botones";
import { colores } from "../../../shared/components/ui/basics/Colores";

const FormularioInsumo = ({ nuevaFila, handleNuevaFila, handleGuardarInsumo, unidades, errorValidacion }) => {

  const handleCambioNumero = (campo, valor) => {
    const regex = /^\d{0,6}(\.\d{0,2})?$/;

    if (regex.test(valor)) {
      handleNuevaFila(campo, valor);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="mb-3">
        <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "22px" }}>Crear Insumo</Text>
      </div>

      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Nombre del insumo</Text>
        <Input
          placeholder="Ej. Harina de Trigo"
          value={nuevaFila.nombre}
          onChange={(e) => handleNuevaFila("nombre", e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Stock Actual</Text>
        <Input
          placeholder="0.00"
          value={nuevaFila.cantidad}
          onChange={(e) => handleCambioNumero("cantidad", e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Stock Recomendado</Text>
        <Input
          placeholder="0.00"
          value={nuevaFila.stock_recomendado}
          onChange={(e) => handleCambioNumero("stock_recomendado", e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Unidad de Medida</Text>
        <SelectField
          placeholder="Selecciona unidad"
          size="forms"
          value={nuevaFila.unidad}
          onChange={(e) => handleNuevaFila("unidad", e.target.value)}
          options={unidades.map(u => ({ value: u.opcion, label: u.opcion }))}
          className="w-full"
        />
      </div>

      {errorValidacion && (
        <div className="text-center">
          <Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>{errorValidacion}</Text>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <Button variant="primario" size="lg" onClick={handleGuardarInsumo} className="w-full">
          Crear Insumo
        </Button>
      </div>
    </div>
  );
};

export default FormularioInsumo;