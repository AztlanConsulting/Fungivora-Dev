import React, { useMemo } from "react";
import Titulo from "../../../shared/components/ui/basics/titulo";
import Text from "../../../shared/components/ui/basics/texto";
import { colores } from "../../../shared/components/ui/basics/colores";
import SelectField from "../../../shared/components/ui/inputs/seleccionar_texto";
import Button from "../../../shared/components/ui/buttons/botones";

// Form para poder crear un bloque, con sus inserts
const FormCrearBloque = ({ codigo, contenedores, bloqueForm, setBloqueForm, handleBloqueForm, onAgregar, error,
  especieSeleccionada, 
  getInoculosPorEspecie,
  idInoculoSeleccionado,
  setIdInoculoLote
 }) => {

  // Validar el número
  const validarNumero = (valor, limite) => {
    let limpio = valor.replace(/[^0-9.]/g, "");

    if (limpio.startsWith("0")) {
      limpio = limpio.substring(1);
    }

    if (limpio.length > limite) {
      limpio = limpio.slice(0, limite);
    }
    const partes = limpio.split(".");
    if (partes.length > 2) {
      limpio = partes[0] + "." + partes.slice(1).join("");
    }

    if (partes[1] && partes[1].length > 2) {
      limpio = parseFloat(limpio).toFixed(2);
    }

    if (limpio === ".") return "";

    return limpio;
  };

  const inoculosOpciones = useMemo(() => {
    if (!especieSeleccionada) return [];
    return getInoculosPorEspecie(especieSeleccionada);
  }, [especieSeleccionada, getInoculosPorEspecie]);

  // Número para peso
  const handleChangePeso = (e) => {
    const valorValidado = validarNumero(e.target.value, 6);
    setBloqueForm({ ...bloqueForm, peso_gr: valorValidado });
  };

  // Número para centidad
  const handleChangeCantidad = (e) => {
    const valorValidado = validarNumero(e.target.value, 2);
    setBloqueForm({ ...bloqueForm, cantidad: valorValidado });
  };
  return (
    <div className="flex flex-col gap-5">
        {/* Titulo */}
      <Titulo>Bloques: {codigo}</Titulo>

      <div className="mb-3 flex justify-between items-center">
        <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "22px" }}>Crear Bloques</Text>
      </div>

      <div className="rounded-xl flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "700" }}>Semilla ({especieSeleccionada})</Text>
        <SelectField 
          placeholder="Selecciona el inóculo para este bloque" 
          size="forms" 
          options={inoculosOpciones} 
          value={idInoculoSeleccionado} 
          onChange={(op) => setIdInoculoLote("id_inoculo", op)} 
        />
      </div>

      <hr className="border-gray-100" />

        {/* Insert de tamaño - contenedores*/}
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Tamaño</Text>
        <SelectField options={contenedores} placeholder="Selecciona tamaño" size="forms" value={bloqueForm.contenedor} onChange={(op) => handleBloqueForm("contenedor", op)} />
      </div>

        {/* Insert de peso*/}
      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Peso</Text>
        <input 
          type="text" 
          inputMode="decimal"
          style={{fontStyle: 'italic'}} 
          placeholder="Ingresa el peso (g)" 
          value={bloqueForm.peso_gr} 
          className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm" 
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
        <input 
          type="text" 
          inputMode="decimal"
          style={{fontStyle: 'italic'}} 
          placeholder="Ingresa cantidad" 
          value={bloqueForm.cantidad} 
          className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm" 
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