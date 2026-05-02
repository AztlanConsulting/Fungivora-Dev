// frontend/src/pages/inoculos/semillas/FormSemilla.jsx
import React, { useState } from "react";
import SelectEspecie from "../../../features/inoculos/components/selecionar_especie";
 
const FormSemilla = () => {
  const [especie, setEspecie] = useState("");
 
  return (
    <div>
      <h1>Crear Inóculo — Semilla</h1>
 
      <SelectEspecie
        value={especie}
        onChange={(e) => setEspecie(e.target.value)}
      />
    </div>
  );
};
 
export default FormSemilla;
 