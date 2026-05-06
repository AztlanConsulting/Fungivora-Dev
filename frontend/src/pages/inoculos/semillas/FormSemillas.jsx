// frontend/src/pages/inoculos/semillas/FormSemilla.jsx
import React, { useState } from "react";
import SelectField from "../../../shared/components/ui/inputs/seleccionar_texto";
import useEspecies from "../../../features/inoculos/hooks/useEspecies";
import Titulo from "../../../shared/components/ui/basics/titulo";
import EntradaCantidad from "../../../shared/components/ui/inputs/entrada_cantidad"
import { EntradaLista } from "../../../shared/components/ui/inoculos/components/seleccionar_cantidades"

const FormSemilla = () => {
  // Estados locales para simular la DB
  const [agua, setAgua] = useState(100);
  const [mijo, setMijo] = useState(60);
  const [queso, setQueso] = useState(80);
  const [pera, setPera] = useState(10);

  const materiales = [
    { 
      nombre: "Agua", 
      unidad: "ml", 
      value: agua, 
      onChange: (e) => setAgua(e.target.value) 
    },
    { 
      nombre: "Mijo", 
      unidad: "g", 
      value: mijo, 
      onChange: (e) => setMijo(e.target.value) 
    },
    { 
      nombre: "Queso", 
      unidad: "g", 
      value: queso, 
      onChange: (e) => setQueso(e.target.value) 
    },
    { 
      nombre: "Pera", 
      unidad: "P", 
      value: pera, 
      onChange: (e) => setPera(e.target.value) 
    }
  ];

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-5">Prueba de Composición</h1>
      <EntradaLista items={materiales} />
    </div>
  );
};

export default FormSemilla;