import React, { useMemo } from "react";
import Titulo from "../../../shared/components/ui/basics/Titulo";
import Text from "../../../shared/components/ui/basics/Texto";
import { colores } from "../../../shared/components/ui/basics/Colores";
import SelectField from "../../../shared/components/ui/inputs/SeleccionarTexto";
import Button from "../../../shared/components/ui/buttons/Botones";
import Input from "../../../shared/components/ui/inputs/InputTexto";

// Form para poder crear un bloque, con sus inserts
const FormCrearBloque = ({ contenedores, bloqueForm, setBloqueForm, handleBloqueForm, onAgregar, error,
  especieSeleccionada, 
  getInoculosPorEspecie
 }) => {

  // Validar el número
  const validarEntero = (valor, limite) => {
    let limpio = valor.replace(/[^0-9]/g, "");

    if (limpio.length > 1 && limpio.startsWith("0")) {
      limpio = limpio.substring(1);
    }
    if (limpio.length > limite) {
      limpio = limpio.slice(0, limite);
    }

    return limpio;
  };

  const inoculosOpciones = useMemo(() => {
    if (!especieSeleccionada) return [];
    return getInoculosPorEspecie(especieSeleccionada);
  }, [especieSeleccionada, getInoculosPorEspecie]);

  // Máximo 5 dígitos
  const handleChangePeso = (e) => {
    const valorValidado = validarEntero(e.target.value, 5);
    setBloqueForm({ ...bloqueForm, peso_gr: valorValidado });
  };

  // Cambiar cantidad
  const handleChangeCantidad = (e) => {
    const valorValidado = validarEntero(e.target.value, 2);
    setBloqueForm({ ...bloqueForm, cantidad: valorValidado });
  };

  return (
    <div className="flex flex-col gap-5">
      <Titulo>Bloques</Titulo>
      <div className="mb-3 flex justify-between items-center">
        <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "22px" }}>Crear Bloques</Text>
      </div>

      <div className="rounded-xl flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Semilla ({especieSeleccionada})</Text>
        <SelectField 
          placeholder="Selecciona el inóculo" 
          size="forms" 
          options={inoculosOpciones} 
          value={bloqueForm.id_inoculo} 
          onChange={(op) => handleBloqueForm("id_inoculo", op)} 
        />
      </div>

        {/* Insert de tamaño - contenedores*/}
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Tamaño</Text>
        <SelectField options={contenedores} placeholder="Selecciona tamaño" size="forms" value={bloqueForm.contenedor} onChange={(op) => handleBloqueForm("contenedor", op)} />
      </div>

      {/* Insert de peso*/}
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Peso</Text>
        <Input
          type="text"
          inputMode="decimal"
          style={{ fontStyle: 'italic' }}
          placeholder="Ingresa el peso (g)"
          value={bloqueForm.peso_gr}
          onChange={handleChangePeso}
        />
      </div>

      {/* Insert de tipo - producción o experimental*/}
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Tipo</Text>
        <SelectField placeholder="Selecciona tipo" size="forms" options={[{ value: "1", label: "Producción" }, { value: "0", label: "Experimental" }]} value={bloqueForm.produccion} onChange={(op) => handleBloqueForm("produccion", op)} />
      </div>

      {/* Insert de cantidad*/}
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Cantidad</Text>
        <Input
          type="text"
          inputMode="decimal"
          style={{ fontStyle: 'italic' }}
          placeholder="Ingresa cantidad"
          value={bloqueForm.cantidad}
          onChange={handleChangeCantidad}
        />
      </div>

      {/* Mensaje de error*/}
      {error && <div className="text-center"><Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>{error}</Text></div>}

      {/* Botón para crear bloque*/}
      <div className="flex justify-center pt-4">
        <Button variant="cancelar" size="lg" className="w-full" onClick={onAgregar}>
          Crear Bloque
        </Button>
      </div>
    </div>
  );
};

export default FormCrearBloque;