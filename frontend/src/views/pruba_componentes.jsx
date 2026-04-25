import React from "react";
import Base from "../componentes/base";
import Text from "../componentes/texto";

function Pruebas() {
  return (
    <Base margen_arriba="mt-8 md:mt-[vh]">
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        
        <Text variante="title">Título</Text>

        <Text variante="popup">Texto Pop Up</Text>

        <Text variante="medium">Texto Mediano</Text>

        <Text variante="label">Texto del select...</Text>

        <Text variante="label">Texto descripción de Input</Text>

        <Text variante="input">Texto número input</Text>

        <Text variante="button">Texto Botón</Text>

        <Text variante="dates">Texto Fechas</Text>

        <Text variante="placeholder">
          Texto Input ejemplo...
        </Text>

        <Text variante="option">Texto Opción</Text>

        <Text variante="selected">
          Texto Opción Seleccionada
        </Text>

      </div>
    </Base>
  );
}

export default Pruebas;