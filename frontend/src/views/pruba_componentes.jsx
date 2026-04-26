import React, { useState } from "react";
import Base from "../componentes/base";
import Titulo from "../componentes/titulo";
import Button from "../componentes/botones";
import Input from "../componentes/input_texto";
import Text from "../componentes/texto";
import InputFecha from "../componentes/input_fecha";

function Pruebas() {
  // Estados para controlar los inputs de prueba
  const [val, setVal] = useState("");
  const [val2, setVal2] = useState("");
  const [val3, setVal3] = useState("");
  const [val4, setVal4] = useState("");
   // Se necesita declara a la fecha vacia
  const [fecha, setFecha] = useState({
    day: "",
    month: "",
    year: ""
  });

  return (
    <>
      <Titulo>
        Prueba de componentes
      </Titulo>

      <Base margen_arriba="mt-44 md:mt-28">
        <div className="flex flex-col gap-4">
          <Button variant="entrar">Entrar</Button>
          <Button variant="cancelar">Cancelar</Button>
          <Button variant="eliminar">Eliminar</Button>
          <Button variant="registrar">Registrar</Button>
          <Button variant="siguiente">Siguiente</Button>
          <Button variant="agregar">Agregar</Button>
          <Button variant="confirmar">Confirmar</Button>

          {/** Inputs de prueba */}
          <Input
            variante="normal"
            placeholder="Escribe tu entrada..."
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />

          <Input
            variante="amplio"
            placeholder="Escribe tu entrada larga..."
            value={val2}
            onChange={(e) => setVal2(e.target.value)}
          />

          <Input
            variante="numero"
            numeroTipo="entero"
            placeholder="0"
            value={val3}
            onChange={(e) => setVal3(e.target.value)}
          />

          <Input
            variante="numero"
            numeroTipo="decimal"
            placeholder="0.0"
            value={val4}
            onChange={(e) => setVal4(e.target.value)}
          />

          {/** Valor guardado en los inputs */}
          <Text variante="label">
            Valor 1: "{val}" Valor 2: "{val2}" Valor 3: "{val3}" Valor 4: "{val4}"
          </Text>

          <InputFecha
            value={fecha}
            onChange={setFecha}
          />

          {/** Valor guardado en el input de fecha */}
          <Text variante="label">
            Fecha: "{fecha.day}/{fecha.month}/{fecha.year}"
          </Text>

        </div>
      </Base>
    </>
  );
}

export default Pruebas;