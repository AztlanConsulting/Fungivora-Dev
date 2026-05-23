// FormCrearLote.jsx
import React from "react"; // Quitamos useMemo porque ya no se usa
import Titulo from "../../../shared/components/ui/basics/Titulo";
import Text from "../../../shared/components/ui/basics/Texto";
import { colores } from "../../../shared/components/ui/basics/Colores";
import SelectField from "../../../shared/components/ui/inputs/seleccionar_texto";
import InputFecha from "../../../shared/components/ui/inputs/input_fecha";
import Button from "../../../shared/components/ui/buttons/Botones";

const FormCrearLote = ({
  especiesDisponibles,
  sustratos,
  ubicaciones,
  nuevaFila,
  fecha,
  setFecha,
  handleNuevaFila,
  onSiguiente,
  error
}) => {

  const handleChangeEspecie = (valor) => {
    const nombreEspecie = valor?.value || valor;
    handleNuevaFila("especie", nombreEspecie);
  };

  return (
    <div className="flex flex-col gap-5">
      <Titulo>Lotes</Titulo>

      <div className="mb-3">
        <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "22px" }}>Crear Lote</Text>
      </div>

      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Especie</Text>
        <SelectField
          placeholder="Selecciona especie"
          options={especiesDisponibles}
          value={nuevaFila.especie}
          onChange={handleChangeEspecie}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Sustrato</Text>
        <SelectField
          placeholder="Selecciona un sustrato"
          size="forms"
          options={sustratos}
          value={nuevaFila.tipo_sustrato}
          onChange={(op) => handleNuevaFila("tipo_sustrato", op)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Ubicación</Text>
        <SelectField
          placeholder="Selecciona una ubicación"
          size="forms"
          options={ubicaciones}
          value={nuevaFila.ubicacion_lote}
          onChange={(op) => handleNuevaFila("ubicacion_lote", op)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Fecha</Text>
        <InputFecha value={fecha} onChange={setFecha} />
      </div>

      {error && (
        <div className="text-center mt-2">
          <Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>{error}</Text>
        </div>
      )}

      <div className="flex justify-center pt-4">
        <Button variant="primario" size="lg" className="w-full" onClick={onSiguiente}>
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default FormCrearLote;