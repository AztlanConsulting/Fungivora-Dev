import React from "react";
import Titulo from "../../../shared/components/ui/basics/titulo";
import Text from "../../../shared/components/ui/basics/texto";
import { colores } from "../../../shared/components/ui/basics/colores";
import SelectField from "../../../shared/components/ui/inputs/seleccionar_texto";
import Button from "../../../shared/components/ui/buttons/botones";

const FormCrearBloque = ({ codigo, contenedores, bloqueForm, setBloqueForm, handleBloqueForm, onAgregar, error }) => {
  return (
    <div className="flex flex-col gap-5">
      <Titulo>Bloques: {codigo}</Titulo>
      <div className="mb-3 flex justify-between items-center">
        <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "22px" }}>Crear Bloques</Text>
      </div>

      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Tamaño</Text>
        <SelectField options={contenedores} placeholder="Selecciona tamaño" size="forms" value={bloqueForm.contenedor} onChange={(op) => handleBloqueForm("contenedor", op)} />
      </div>

      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Peso</Text>
        <input type="number" style={{fontStyle: 'italic'}} placeholder="Ingresa el peso (g)" value={bloqueForm.peso_gr} className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm" onChange={(e) => setBloqueForm({...bloqueForm, peso_gr: e.target.value})} />
      </div>

      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Tipo</Text>
        <SelectField placeholder="Selecciona tipo" size="forms" options={[{ value: "1", label: "Producción" }, { value: "0", label: "Experimental" }]} value={bloqueForm.produccion} onChange={(op) => handleBloqueForm("produccion", op)} />
      </div>

      <div className="flex flex-col gap-2">
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Cantidad</Text>
        <input type="number" style={{fontStyle: 'italic'}} placeholder="Ingresa cantidad" value={bloqueForm.cantidad} className="border p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm" onChange={(e) => setBloqueForm({...bloqueForm, cantidad: e.target.value})} />
      </div>

      {error && <div className="text-center"><Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>{error}</Text></div>}
      
      <div className="flex justify-center pt-4">
        <Button variant="cancelar" size="lg" className="w-full" onClick={onAgregar}>
          Crear Bloque
        </Button>         
      </div>
    </div>
  );
};

export default FormCrearBloque;