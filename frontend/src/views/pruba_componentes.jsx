import React, { useState } from "react";
import Base from "../componentes/base";
import Titulo from "../componentes/titulo";
import Button from "../componentes/botones";
import Input from "../componentes/input_texto";
import Text from "../componentes/texto";
import { EntradaCantidadLista } from "../componentes/entrada_cantidad";
import BarraBusqueda from "../componentes/barra_busqueda";
import { HugeiconsIcon } from '@hugeicons/react';
import { Search02Icon } from '@hugeicons/core-free-icons';

function Pruebas() {
  const [val, setVal] = useState("");
  const [val2, setVal2] = useState("");
  const [val3, setVal3] = useState("");
  const [val4, setVal4] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const [cantidades, setCantidades] = useState({
    agua: "0",
    miel: "0",
    peptona: "0",
  });
  const set = (key) => (e) =>
    setCantidades((prev) => ({ ...prev, [key]: e.target.value }));

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

          <Text variante="label">
            Valor 1: "{val}" Valor 2: "{val2}" Valor 3: "{val3}" Valor 4: "{val4}"
          </Text>

          <EntradaCantidadLista
            items={[
              { nombre: "Agua destilada", unidad: "ml", value: cantidades.agua,    onChange: set("agua") },
              { nombre: "Miel",           unidad: "g",  value: cantidades.miel,    onChange: set("miel") },
              { nombre: "Peptona",        unidad: "ml", value: cantidades.peptona, onChange: set("peptona") },
            ]}
          />

          <Text variante="label">
            Agua: "{cantidades.agua}" Miel: "{cantidades.miel}" Peptona: "{cantidades.peptona}"
          </Text>

          {/** Barra de búsqueda */}
          <BarraBusqueda
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar..."
            icon={<HugeiconsIcon icon={Search02Icon} size={20} />}
          />

          <Text variante="label">
            Búsqueda: "{busqueda}"
          </Text>

        </div>
      </Base>
    </>
  );
}

export default Pruebas;