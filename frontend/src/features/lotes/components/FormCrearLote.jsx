import React, { useMemo } from "react";
import Titulo from "../../../shared/components/ui/basics/titulo";
import Text from "../../../shared/components/ui/basics/texto";
import { colores } from "../../../shared/components/ui/basics/colores";
import SelectField from "../../../shared/components/ui/inputs/seleccionar_texto";
import InputFecha from "../../../shared/components/ui/inputs/input_fecha";
import Button from "../../../shared/components/ui/buttons/botones";

// Form para poder crear un lote, con sus inserts
const FormCrearLote = ({ especiesDisponibles, getInoculosPorEspecie, sustratos, ubicaciones, nuevaFila, fecha, setFecha, handleNuevaFila, onSiguiente, error }) => {

    // Que en la especie no este seleccionado algun valor
    const valorEspecie = nuevaFila.especie || "";

    // Obtenemos los inóculos cuando cambia la especie 
    const inoculosOpciones = useMemo(() => {
        if (!valorEspecie) return [];
        return getInoculosPorEspecie(valorEspecie);
    }, [valorEspecie, getInoculosPorEspecie]);

    const handleChangeEspecie = (valor) => {
        const nombreEspecie = valor?.value || valor; 
        
        handleNuevaFila("especie", nombreEspecie);
        handleNuevaFila("id_inoculo", ""); 
    };

  return (
    <div className="flex flex-col gap-5">
    {/* Titulo*/}
      <Titulo>Lotes</Titulo>

      <div className="mb-3">
        <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "22px" }}>Crear Lote</Text>
      </div>

        {/* Insert de especie*/}
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Especie</Text>
        <SelectField 
          placeholder="Selecciona especie" 
          options={especiesDisponibles} 
          value={nuevaFila.especie} 
          onChange={handleChangeEspecie} 
        />
      </div>

        {/* Insert de semilla - inóculo por especie*/}
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Semilla</Text>
        <SelectField 
          placeholder={nuevaFila.especie ? "Selecciona inóculo" : "Primero elige una especie"} 
          size="forms" 
          disabled={!nuevaFila.especie}
          options={inoculosOpciones} 
          value={nuevaFila.id_inoculo} 
          onChange={(op) => handleNuevaFila("id_inoculo", op)} 
        />
      </div>

        {/* Insert de sustrato*/}
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

        {/* Insert de ubicación*/}
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

        {/* Insert de fecha*/}
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Fecha</Text>
        <InputFecha value={fecha} onChange={setFecha} />
      </div>

        {/* Mensaje de Error*/}
      {error && (
        <div className="text-center mt-2">
          <Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>{error}</Text>
        </div>
      )}

        {/* Botón de crear lote*/}
      <div className="flex justify-center pt-4">
        <Button variant="primario" size="lg" className="w-full" onClick={onSiguiente}>
          Crear Lote
        </Button>
      </div>
    </div>
  );
};

export default FormCrearLote;