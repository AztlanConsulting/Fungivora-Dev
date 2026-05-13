import React from "react";
import Titulo from "../../../shared/components/ui/basics/titulo";
import CrearMedioLiquido from "../../../features/crear_inoculos/components/CrearMedioLiquido";

const FormMedioLiquido = () => {
  return (
    <div className="min-h-screen">
      <Titulo>Crear Medio Líquido</Titulo>
      <CrearMedioLiquido />
    </div>
  );
};

export default FormMedioLiquido;
