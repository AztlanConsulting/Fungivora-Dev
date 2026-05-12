import React, { useState } from "react";
import SelectField from "../../../shared/components/ui/inputs/seleccionar_texto";
import useEspecies from "../../../features/inoculos/hooks/useEspecies";
import useInoculoParaSemilla from "../../../features/inoculos/hooks/useInoculoprarasemillas";
import Titulo from "../../../shared/components/ui/basics/titulo";

const FormSemilla = () => {
  const [especie, setEspecie] = useState("");
  const [inoculoId, setInoculoId] = useState("");
  const [inoculoRaw, setInoculoRaw] = useState(null);
  const { especies, loading: loadingEspecies, error: errorEspecies } = useEspecies();
  const { opciones: opcionesInoculo, loading: loadingInoculo, error: errorInoculo } = useInoculoParaSemilla(especie);
  const opcionesEspecies = especies.map((esp) => ({
    value: esp.especie,
    label: esp.especie,
  }));

  /*
   * handleEspecieChange
   * Actualiza la especie seleccionada y resetea el inoculo dependiente
   * Evita que quede un inoculo de una especie anterior
   */
  const handleEspecieChange = (e) => {
    setEspecie(e.target.value);
    setInoculoId("");
    setInoculoRaw(null);
  };

  /*
   * handleInoculoChange
   * Actualiza el id del inoculo y extrae el objeto raw para uso externo
   * @param e - evento nativo del select
   */
  const handleInoculoChange = (e) => {
    setInoculoId(e.target.value);
    const seleccionado = opcionesInoculo.find(
      (op) => String(op.value) === String(e.target.value)
    );
    setInoculoRaw(seleccionado?.raw ?? null);
  };

  const sinEspecie = !especie;
  const sinOpciones = !loadingInoculo && !errorInoculo && especie && opcionesInoculo.length === 0;

  const placeholderInoculo = sinEspecie
    ? "Selecciona una especie primero"
      : sinOpciones
      ? "Sin inóculos disponibles para esta especie"
      : "Selecciona inóculo";

  return (
    <div>
      

      <SelectField
        label="Especie"
        value={especie}
        onChange={handleEspecieChange}
        placeholder="Selecciona una especie..."
        options={opcionesEspecies}
        loading={loadingEspecies}
        error={errorEspecies}
      />

      <SelectField
        label="Inóculo"
        value={inoculoId}
        onChange={handleInoculoChange}
        placeholder={placeholderInoculo}
        options={opcionesInoculo}
        loading={loadingInoculo}
        error={errorInoculo}
        disabled={sinEspecie || sinOpciones || loadingInoculo}
      />
    </div>
  );
};

export default FormSemilla;