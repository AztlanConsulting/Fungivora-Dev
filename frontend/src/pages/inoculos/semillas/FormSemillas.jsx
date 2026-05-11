// frontend/src/pages/inoculos/semillas/FormSemilla.jsx
import React, { useState } from "react";
import SelectEspecie from "../../../features/inoculos/components/selecionar_especie";
import SelectInoculo from "../../../features/inoculos/components/selecionar_inoculo";
import Titulo from "../../../shared/components/ui/basics/titulo";

const FormSemilla = () => {
  const [especie, setEspecie] = useState("");
  const [inoculoId, setInoculoId] = useState("");
  const [inoculoRaw, setInoculoRaw] = useState(null);

  const handleEspecieChange = (e) => {
    setEspecie(e.target.value);
    // Resetea el inóculo si cambia la especie
    setInoculoId("");
    setInoculoRaw(null);
  };

  return (
    <div>

      {/* Campo especie — usa SelectEspecie que maneja su propio fetch */}
      <SelectEspecie
        value={especie}
        onChange={handleEspecieChange}
      />

      {/* Campo inóculo — se filtra automáticamente por la especie elegida */}
      <SelectInoculo
        especie={especie}
        value={inoculoId}
        onChange={(e) => setInoculoId(e.target.value)}
        onRawChange={(raw) => setInoculoRaw(raw)}
      />
    </div>
  );
};

export default FormSemilla;