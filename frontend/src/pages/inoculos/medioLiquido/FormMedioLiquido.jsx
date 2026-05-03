// frontend/src/pages/inoculos/medioLiquido/FormMedioLiquido.jsx
import React, { useState } from "react";
import SelectField from "../../../shared/components/ui/inputs/seleccionar_texto";
import useEspecies from "../../../features/inoculos/hooks/useEspecies";
import Titulo from "../../../shared/components/ui/basics/titulo";

const FormSemilla = () => {
  const [especie, setEspecie] = useState("");
  const { especies, loading, error } = useEspecies();
 
  const opcionesEspecies = especies.map((esp) => ({
    value: esp.especie,
    label: esp.especie,
  }));
 
  return (
    <div className="pt-24 px-8 md:px-12">
      <Titulo>Crear Inóculo — Semilla</Titulo>
 
      <SelectField
        value={especie}
        onChange={(e) => setEspecie(e.target.value)}
        placeholder="Selecciona una especie..."
        options={opcionesEspecies}
        loading={loading}
        error={error}
        label="Especie"
      />
    </div>
  );
};
 
export default FormSemilla;