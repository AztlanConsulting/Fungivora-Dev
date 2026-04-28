import React, { useState } from "react";
import Base from "../componentes/base";
import Titulo from "../componentes/titulo";
import Button from "../componentes/botones";
import Input from "../componentes/input_texto";
import Text from "../componentes/texto";
import InputFecha from "../componentes/input_fecha";
import Stepper from "../componentes/stepper";
import Slider from "../componentes/slider";
import Select from "../componentes/seleccionar_texto"; 
import { EntradaCantidadLista } from "../componentes/entrada_cantidad";
import BarraBusqueda from "../componentes/barra_busqueda";
import ModalConfirmacion from "../componentes/modal_confirmacion";

import { HugeiconsIcon } from '@hugeicons/react';
import { StarIcon } from '@hugeicons/core-free-icons';

function Pruebas() {
  const [val, setVal] = useState("");
  const [val2, setVal2] = useState("");
  const [val3, setVal3] = useState("");
  const [val4, setVal4] = useState("");
  const [val6, setVal6] = useState("");
  const [val7, setVal7] = useState("");
  const [val8, setVal8] = useState("");

  const [sliderVal, setSliderVal] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [seleccionado, setSeleccionado] = useState("");

  const [cantidades, setCantidades] = useState({
    agua: "",
    miel: "",
    peptona: "",
  });

  const set = (key) => (e) =>
    setCantidades((prev) => ({ ...prev, [key]: e.target.value }));

  const [fecha, setFecha] = useState({ day: "", month: "", year: "" });
  const [pasoActual, setPasoActual] = useState(0);
  const [pasoActual2, setPasoActual2] = useState(0);

  const misPasos = [{ label: "Lote" }, { label: "Bloque" }];
  const misPasos2 = [
    { label: "Inoculación" },
    { label: "Colonización" },
    { label: "Fructificación" },
    { label: "Cosecha 1" },
    { label: "Cosecha 2" },
    { label: "Finalización" },
  ];

  const avanzarPasoReadOnly = () => {
    if (pasoActual < misPasos.length - 1) {
      setPasoActual(pasoActual + 1);
    } else {
      setPasoActual(0);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleDelete = () => {
    console.log("Registro eliminado correctamente");
    setIsModalOpen(false); 
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">

      {/* IZQUIERDA */}
      <div className="flex flex-col w-full md:w-1/2 h-full border-r-2 border-gray-200">

        {/* HEADER */}
        <div className="w-full bg-[#3b3fb6] p-6 shrink-0 shadow-md">
          <Titulo color="white">Prueba de componentes</Titulo>
        </div>

        {/* SCROLL — El botón ahora está aquí arriba */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
          <Base margen_arriba="mt-10">
            <div className="flex flex-col gap-8">

              
              {/* BOTONES */}
              <div className="flex flex-wrap gap-2">
                <Button variant="entrar">Entrar</Button>
                <Button variant="cancelar">Cancelar</Button>
                <Button variant="eliminar" isOutline={true}>Eliminar</Button>
                <Button variant="registrar" isOutline={true}>Registrar</Button>
                <Button variant="siguiente">Siguiente</Button>
                <Button variant="agregar" isOutline={true}>Agregar</Button>
                <Button variant="confirmar">Confirmar</Button>
              </div>

              {/* INPUTS */}
              <Input variante="normal" placeholder="Escribe..." value={val} onChange={(e) => setVal(e.target.value)} />
              <Input variante="amplio" placeholder="Texto largo..." value={val2} onChange={(e) => setVal2(e.target.value)} />
              <Input variante="numero" numeroTipo="entero" placeholder="0" value={val3} onChange={(e) => setVal3(e.target.value)} />
              <Input variante="numero" numeroTipo="decimal" placeholder="0.0" value={val4} onChange={(e) => setVal4(e.target.value)} />

              <Text variante="label">
                Valores: "{val}" "{val2}" "{val3}" "{val4}"
              </Text>

              <InputFecha value={fecha} onChange={setFecha} />

              <Slider value={sliderVal} onChange={setSliderVal} />
              <Text variante="label">Slider: {sliderVal}%</Text>

              <EntradaCantidadLista
                items={[
                  { nombre: "Agua", unidad: "ml", value: cantidades.agua, onChange: set("agua") },
                  { nombre: "Miel", unidad: "g", value: cantidades.miel, onChange: set("miel") },
                  { nombre: "Peptona", unidad: "ml", value: cantidades.peptona, onChange: set("peptona") },
                ]}
              />

              <BarraBusqueda value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />              

              {/* Selecionar */}
          <Text variante="label" as="label">Selecciona</Text>
          <Select
            value={seleccionado}
            onChange={(e) => setSeleccionado(e.target.value)}
            placeholder="Selecciona una opcion.."
            options={[
              {value: "1", label: "Opcion 1"},
              {value: "2", label: "Opcion 2"}   
            ]}
            />

            <Text variante="label">
              Valor: "{seleccionado}"
            </Text>


              <Text variante="medium">Prueba de Modal</Text>
                <Button 
                  variant="eliminar" 
                  onClick={() => setIsModalOpen(true)}
                >
                  Modal de Confirmación
                </Button>

              <Stepper 
                  steps={misPasos} 
                  currentStep={pasoActual} 
                  colorTheme="verde" 
                  readOnly={true}
                />
              
              <Stepper 
                steps={misPasos2} 
                currentStep={pasoActual2} 
                onStepChange={setPasoActual2} 
                colorTheme="azul" 
              />

              <Button variant="siguiente" onClick={avanzarPasoReadOnly}>
                  Siguiente Paso
              </Button>

              <div className="pb-20" />
            </div>
          </Base>
        </div>
      </div>

      {/* DERECHA */}
      <div className="hidden md:flex md:w-1/2 h-full bg-gray-50 items-center justify-center p-10">
        <div className="flex flex-col gap-6 w-full max-w-sm">
          <Text variante="medium">Configuración Fija</Text>
          <Input variante="amplio" value={val6} onChange={(e) => setVal6(e.target.value)} />
          <Input variante="numero" numeroTipo="entero" value={val7} onChange={(e) => setVal7(e.target.value)} />
          <Input variante="numero" numeroTipo="decimal" value={val8} onChange={(e) => setVal8(e.target.value)} />
        </div>
      </div>

      {/* MODAL */}
      <ModalConfirmacion
        visible={isModalOpen}
        icon={StarIcon}
        titulo="¿Confirmar cierre de sesión?"
        descripcion="Si eliminas este cultivo de hongos, se borrarán todos los datos asociados."
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
        textoConfirmar="Confirmar"
        textoCancelar="Cancelar"
      />


    </div>
  );
}

export default Pruebas;