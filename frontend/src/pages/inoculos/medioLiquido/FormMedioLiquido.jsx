import React, { useState } from "react";
import SelectField from "../../../shared/components/ui/inputs/seleccionar_texto";
import useEspecies from "../../../features/inoculos/hooks/useEspecies";
import useInoculoParaSemilla from "../../../features/inoculos/hooks/useInoculoprarasemillas";
import Titulo from "../../../shared/components/ui/basics/titulo";
import CrearMedioLiquido from "../../../features/crear_inoculos/components/CrearMedioLiquido";

const FormMedioLiquido = () => {
  const [especie, setEspecie] = useState("");
  const [inoculoId, setInoculoId] = useState("");
  const { especies, loading: loadingEspecies, error: errorEspecies } = useEspecies();
  const { opciones, loading: loadingInoculo, error: errorInoculo } = useInoculoParaSemilla(especie);

  const opcionesEspecies = especies.map((esp) => ({
    value: esp.especie,
    label: esp.especie,
  }));

  /*
  * handleEspecieChange
  Maneja el cambio de especie en el select
  Resetea el inoculo seleccionado al cambiar la especie
  @param e - Evento del select
  */
  const handleEspecieChange = (e) => {
    setEspecie(e.target.value);
    setInoculoId("");
  };

  return (
    <div className="min-h-screen pt-24 px-8 md:px-12">
      <Titulo>Crear Inoculo — Medio Liquido</Titulo>

      {/* Seleccion de especie */}
      <SelectField
        label="Especie"
        value={especie}
        onChange={handleEspecieChange}
        placeholder="Selecciona una especie..."
        options={opcionesEspecies}
        loading={loadingEspecies}
        error={errorEspecies}
      />

      {/* Seleccion de inoculo filtrado por especie */}
      <SelectField
        label="Inoculo"
        value={inoculoId}
        onChange={(e) => setInoculoId(e.target.value)}
        placeholder={
          !especie
            ? "Selecciona una especie primero"
            : opciones.length === 0 && !loadingInoculo
            ? "Sin inoculos disponibles para esta especie"
            : "Selecciona inoculo"
        }
        options={opciones}
        loading={loadingInoculo}
        error={errorInoculo}
        disabled={!especie || (opciones.length === 0 && !loadingInoculo)}
      />

      <CrearMedioLiquido />
    </div>
  );
};

export default FormMedioLiquido;