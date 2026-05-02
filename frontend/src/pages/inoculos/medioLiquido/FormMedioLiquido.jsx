// frontend/src/pages/inoculos/medioLiquido/FormMedioLiquido.jsx
import React, { useState } from "react";
import SelectEspecie from "../../../features/inoculos/components/selecionar_especie";
 
const FormMedioLiquido = () => {
  const [especie, setEspecie] = useState("");
 
  return (
    <div>
      <h1>Crear Inóculo — Medio Líquido</h1>
 
      <SelectEspecie
        value={especie}
        onChange={(e) => setEspecie(e.target.value)}
      />
    </div>
  );
};
 
export default FormMedioLiquido;
 