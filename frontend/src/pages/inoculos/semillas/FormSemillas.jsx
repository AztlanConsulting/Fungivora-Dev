// frontend/src/pages/inoculos/semillas/FormSemilla.jsx
import React, { useState } from "react";
import SelectField from "../../../shared/components/ui/inputs/seleccionar_texto";
import useEspecies from "../../../features/inoculos/hooks/useEspecies";

const FormSemilla = () => {
  const [especie, setEspecie] = useState("");
  const { especies, loading, error } = useEspecies();

  const opcionesEspecies = especies.map((esp) => ({
    value: esp.especie,
    label: esp.especie,
  }));

  return (
    <div>
      <h1>Crear Inóculo — Semilla</h1>

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