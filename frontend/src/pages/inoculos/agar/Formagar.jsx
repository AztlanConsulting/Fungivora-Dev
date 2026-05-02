// frontend/src/pages/inoculos/agar/FormAgar.jsx
import React, { useState } from "react";
import SelectEspecie from "../../../features/inoculos/components/selecionar_especie";

const FormAgar = () => {
  const [especie, setEspecie] = useState("");

  return (
    <div>
      <h1>Crear Inóculo — Agar</h1>

      <SelectEspecie
        value={especie}
        onChange={(e) => setEspecie(e.target.value)}
      />
    </div>
  );
};

export default FormAgar;