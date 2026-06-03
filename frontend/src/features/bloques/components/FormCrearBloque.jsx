import React, { useMemo } from "react";
import Text from "../../../shared/components/ui/basics/Texto";
import { colores } from "../../../shared/components/ui/basics/Colores";
import SelectField from "../../../shared/components/ui/inputs/SeleccionarTexto";
import Button from "../../../shared/components/ui/buttons/Botones";
import Input from "../../../shared/components/ui/inputs/InputTexto";
import Titulo from "../../../shared/components/ui/basics/Titulo";

const FormCrearBloque = ({ 
  contenedores, 
  sustratos,
  bloqueForm, 
  setBloqueForm, 
  handleBloqueForm, 
  onAgregar, 
  error,
  especieSeleccionada, 
  getInoculosPorEspecie
}) => {

  const inoculosOpciones = useMemo(() => {
    if (!especieSeleccionada) return [];
    return getInoculosPorEspecie(especieSeleccionada);
  }, [especieSeleccionada, getInoculosPorEspecie]);

  const validarPeso = (valor) => {
    let limpio = valor.replace(/[^0-9.]/g, "");
    const partes = limpio.split(".");
    if (partes.length > 2) limpio = partes[0] + "." + partes.slice(1).join("");
    if (partes[0].length > 5) partes[0] = partes[0].slice(0, 5);
    if (partes[1] !== undefined && partes[1].length > 2) partes[1] = partes[1].slice(0, 2);
    limpio = partes[0] + (partes[1] !== undefined ? "." + partes[1] : "");
    return limpio.startsWith(".") ? "0" + limpio : limpio;
  };

  const handleChangePeso = (e) => setBloqueForm({ ...bloqueForm, peso_gr: validarPeso(e.target.value) });

  const handleChangeCantidad = (e) => {
    let valor = e.target.value.replace(/[^0-9]/g, ""); 
    let numero = valor === "" ? "" : Math.min(parseInt(valor, 10), 100);
    setBloqueForm({ ...bloqueForm, cantidad: numero.toString() });
  };

  const inputContainerClasses = "flex flex-col gap-2 w-full";

  return (
    <form 
      className="flex flex-col gap-5 max-w-md mx-auto w-full px-2 sm:px-0"
      onSubmit={(e) => { e.preventDefault(); onAgregar(); }}
    >
      <Titulo>Bloques</Titulo>
      <div className="text-center">

        <Text variante="medium" style={{ color: colores.azul, fontWeight: "700", fontSize: "22px" }}>
          Crear Bloques
        </Text>
      </div>

      <div className={inputContainerClasses}>
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Semilla ({especieSeleccionada})</Text>
        <SelectField 
          placeholder="Selecciona el inóculo" 
          size="forms" 
          options={inoculosOpciones} 
          value={bloqueForm.id_inoculo} 
          onChange={(op) => handleBloqueForm("id_inoculo", op)} 
        />
      </div>

      <div className={inputContainerClasses}>
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Sustrato</Text>
        <SelectField 
          options={sustratos} 
          placeholder="Selecciona sustrato" 
          size="forms" 
          value={bloqueForm.tipo_sustrato} 
          onChange={(op) => handleBloqueForm("tipo_sustrato", op)} 
        />
      </div>

      <div className={inputContainerClasses}>
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Tamaño</Text>
        <SelectField options={contenedores} placeholder="Selecciona tamaño" size="forms" value={bloqueForm.contenedor} onChange={(op) => handleBloqueForm("contenedor", op)} />
      </div>

      <div className={inputContainerClasses}>
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Peso (g)</Text>
        <Input
          variante="numero"
          numeroTipo="decimal"
          inputMode="decimal"
          style={{ fontStyle: 'italic' }}
          placeholder="0.00"
          value={bloqueForm.peso_gr}
          onChange={handleChangePeso}
        />
      </div>

      <div className={inputContainerClasses}>
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Tipo</Text>
        <SelectField 
          placeholder="Selecciona tipo" 
          size="forms" 
          options={[{ value: "1", label: "Producción" }, { value: "0", label: "Experimental" }]} 
          value={bloqueForm.produccion} 
          onChange={(op) => handleBloqueForm("produccion", op)} 
        />
      </div>

      <div className={inputContainerClasses}>
        <Text variante="label" style={{ color: colores.black, fontWeight: "600" }}>Cantidad</Text>
        <Input
          variante="numero"
          placeholder="0"
          value={bloqueForm.cantidad}
          onChange={handleChangeCantidad}
        />
      </div>

      {error && (
        <div className="text-center p-2">
          <Text variante="label" style={{ color: "#E53E3E", fontWeight: "600" }}>{error}</Text>
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Button variant="primario" size="lg" className="w-full sm:max-w-[200px]" type="submit">
          Crear Bloque
        </Button>
      </div>
    </form>
  );
};

export default FormCrearBloque;