import React from "react";
import Titulo from "../../../shared/components/ui/basics/titulo";
import Text from "../../../shared/components/ui/basics/texto";
import { colores } from "../../../shared/components/ui/basics/colores";
import SelectField from "../../../shared/components/ui/inputs/seleccionar_texto";
import InputFecha from "../../../shared/components/ui/inputs/input_fecha";
import Button from "../../../shared/components/ui/buttons/botones";

const FormCrearLote = ({ especies, sustratos, ubicaciones, nuevaFila, fecha, setFecha, handleNuevaFila, onSiguiente, error }) => {
  return (
    <div className="flex flex-col gap-5">
      <Titulo>Lotes</Titulo>
      <div className="mb-3">
        <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "22px" }}>Crear Lote</Text>
      </div>
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Inóculo / (Especie)</Text>
        <SelectField placeholder="Selecciona inóculo" size="forms" options={especies} value={nuevaFila.id_inoculo} onChange={(op) => handleNuevaFila("id_inoculo", op)} />
      </div>
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Sustrato</Text>
        <SelectField placeholder="Selecciona un sustrato" size="forms" options={sustratos} value={nuevaFila.tipo_sustrato} onChange={(op) => handleNuevaFila("tipo_sustrato", op)} />
      </div>
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Ubicación</Text>
        <SelectField placeholder="Selecciona una ubicación" size="forms" options={ubicaciones} value={nuevaFila.ubicacion_lote} onChange={(op) => handleNuevaFila("ubicacion_lote", op)} />
      </div>
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Fecha</Text>
        <InputFecha value={fecha} onChange={setFecha} />
      </div>
      {error && <div className="text-center mt-2"><Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>{error}</Text></div>}
      <div className="flex justify-center pt-4">
        <Button variant="primario" size="lg" className="w-full" onClick={onSiguiente}>Crear Lote</Button>
      </div>
    </div>
  );
};

export default FormCrearLote;