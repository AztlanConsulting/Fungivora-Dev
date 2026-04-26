import React, { useState } from "react";
import Base from "../componentes/base";
import Titulo from "../componentes/titulo";
import Button from "../componentes/botones";
import Input from "../componentes/input_texto";
import Text from "../componentes/texto";
import InputFecha from "../componentes/input_fecha";
import Stepper from "../componentes/stepper";

function Pruebas() {
  const [val, setVal] = useState("");
  const [val2, setVal2] = useState("");
  const [val3, setVal3] = useState("");
  const [val4, setVal4] = useState("");
  const [val6, setVal6] = useState("");
  const [val7, setVal7] = useState("");
  const [val8, setVal8] = useState("");

  const [fecha, setFecha] = useState({ day: "", month: "", year: "" });
  const [pasoActual, setPasoActual] = useState(0);
  const [pasoActual2, setPasoActual2] = useState(0);

  const misPasos = [{ label: "Lote" }, { label: "Bloque" }];
  const misPasos2 = [
    { label: "Inoculación" }, { label: "Colonización" },
    { label: "Fructificación" }, { label: "Cosecha 1" },
    { label: "Cosecha 2" }, { label: "Finalización" }
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      <div className="flex flex-col w-full md:w-1/2 h-full border-r-2 border-gray-200">
        
        {/*Título */}
        <div className="w-full bg-[#3b3fb6] p-6 shrink-0 shadow-md">
          <Titulo color="white">Prueba de componentes</Titulo>
        </div>

        {/* Área movible */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
          <Base margen_arriba="mt-24 md:mt-10">
            <div className="flex flex-col gap-6">

              {/* Botones */}
              <div className="flex flex-wrap gap-2">
                <Button variant="entrar">Entrar</Button>
                <Button variant="cancelar">Cancelar</Button>
                <Button variant="eliminar">Eliminar</Button>
                <Button variant="registrar">Registrar</Button>
                <Button variant="siguiente">Siguiente</Button>
                <Button variant="agregar">Agregar</Button>
                <Button variant="confirmar">Confirmar</Button>
              </div>

              {/* Input texto*/}
              <Input
                variante="normal"
                placeholder="Escribe tu entrada..."
                value={val}
                onChange={(e) => setVal(e.target.value)}
              />

              {/* Input texto largo*/}
              <Input
                variante="amplio"
                placeholder="Escribe tu entrada larga..."
                value={val2}
                onChange={(e) => setVal2(e.target.value)}
              />

              {/* Input número*/}
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

              <Text variante="label">
                Valor 1: "{val}" Valor 2: "{val2}" Valor 3: "{val3}" Valor 4: "{val4}"
              </Text>

              {/* Input fecha*/}
              <InputFecha value={fecha} onChange={setFecha} />

              <Text variante="label">
                Fecha: "{fecha.day}/{fecha.month}/{fecha.year}"
              </Text>

              {/* Stepper verde */}
              <Stepper 
                steps={misPasos} 
                currentStep={pasoActual} 
                onStepChange={setPasoActual}
                colorTheme="verde" 
              />

              {/* Stepper azul */}
              <Stepper 
                steps={misPasos2} 
                currentStep={pasoActual2} 
                onStepChange={setPasoActual2}
                colorTheme="azul" 
              />
              <div className="pb-20" />
            </div>
          </Base>
        </div>
      </div>

      {/* Área fija */}
      <div className="hidden md:flex md:w-1/2 h-full bg-white items-center justify-center p-10">
      <div className="flex flex-col gap-6">
        <Text variante="lmedium">Configuración Fija</Text>
              <Input
                variante="amplio"
                placeholder="Escribe tu entrada larga..."
                value={val6}
                onChange={(e) => setVal6(e.target.value)}
              />

              <Input
                variante="numero"
                numeroTipo="entero"
                placeholder="0"
                value={val7}
                onChange={(e) => setVal7(e.target.value)}
              />

              <Input
                variante="numero"
                numeroTipo="decimal"
                placeholder="0.0"
                value={val8}
                onChange={(e) => setVal8(e.target.value)}
              />
          </div>
      </div>

    </div>
  );
}

export default Pruebas;