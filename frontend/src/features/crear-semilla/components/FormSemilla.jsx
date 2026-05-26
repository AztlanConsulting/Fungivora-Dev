import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import SelectField from "../../../shared/components/ui/inputs/SeleccionarTexto";
import InputFecha from "../../../shared/components/ui/inputs/InputFecha";
import InputCantidad from "../../../shared/components/ui/inputs/InputCantidad";
import InputNota from "../../../shared/components/ui/inputs/InputNota";
import Button from "../../../shared/components/ui/buttons/Botones";
import ModalAlerta from "../../../shared/components/ui/popups/ModalAlerta";

import { EntradaLista } from "../../../shared/crear-inoculos/components/SeleccionarCantidades";
import Resumen from "../../../shared/crear-inoculos/components/Resumen";
import insumosService from "../../../shared/crear-inoculos/services/inoculos.service";
import { BOLSAS } from "../../../shared/crear-inoculos/types/inoculos.types";
import { crearInoculoDTO } from "../../../shared/crear-inoculos/dto/crearInoculoDto";

import { traducirError } from "../../../shared/utils/traducirError";

import useEspecies from "../../inoculos/hooks/useEspecies";

import useCategorias from "../../../shared/crear-inoculos/hooks/useCategorias";
import useInoculo from "../../../shared/crear-inoculos/hooks/useInoculo";
import useIngredientesSemilla from "../hooks/useIngredientesSemilla";
import {
  generarCodigos,
  normalizarTipoInoculo,
} from "../../../shared/crear-inoculos/utils/generarCodigoInoculo";

import Titulo from "../../../shared/components/ui/basics/Titulo";
import Text from "../../../shared/components/ui/basics/Texto";
import { Base } from "../../../shared/components/layout";
import { colores } from "../../../shared/components/ui/basics/Colores";

const TIPO_CREACION = "semilla";

const OPCIONES_TAMANO = [
  { value: "chico", label: "Chico" },
  { value: "mediano", label: "Mediano" },
  { value: "grande", label: "Grande" },
];

const FormSemillas = () => {
  const navigate = useNavigate();

  const [especie, setEspecie] = useState("");
  const [inoculo, setInoculo] = useState("");
  const [esComprado, setEsComprado] = useState(false);
  const [mijo, setMijo] = useState("");
  const [tamano, setTamano] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const hoy = new Date();
  const [fecha, setFecha] = useState({
    day: String(hoy.getDate()).padStart(2, "0"),
    month: String(hoy.getMonth() + 1).padStart(2, "0"),
    year: String(hoy.getFullYear()),
  });
  const [nota, setNota] = useState("");

  const { especies, loading: loadingEspecies, error: errorEspecies } = useEspecies();
  const { opciones: inoculos, loading: loadingInoculos, error: errorInoculos } = useInoculo(especie, TIPO_CREACION);
  const { categorias, loading: loadingCategorias } = useCategorias();
  const [registrando, setRegistrando] = useState(false);
  const [alerta, setAlerta] = useState({ visible: false, variante: "exito", mensaje: "" });

  const inoculoSeleccionado = !esComprado ? (inoculos ?? []).find((ino) => ino.codigo === inoculo) : null;
  const tipoInoculo = normalizarTipoInoculo(inoculoSeleccionado?.raw?.tipo);
  const inoculoDisponible = inoculoSeleccionado?.raw?.cantidad_disponible ?? 0;
  const codigoInoculo = esComprado ? "Comprado" : (inoculoSeleccionado?.codigo ?? "");
  const cantidadFinal = BOLSAS[tamano] ?? cantidad;
  
  const {
    items: itemsComposicion,
    valores: valoresComposicion,
    opcionesMijo,
    tieneErrores: tieneErroresComposicion,
    loading: loadingInsumos,
  } = useIngredientesSemilla({
    inoculoDisponible,
    tipoMijo: mijo,
    codigoInoculo,
    tamano,
    tipoInoculo,
    cantidad,
  });

  const opcionesEspecies = especies.map((esp) => ({
    value: esp.especie,
    label: esp.especie,
  }));

  const opcionesInoculos = (inoculos ?? []).map((ino) => ({
    value: ino.codigo,
    label: ino.label,
  }));

  const codigos = useMemo(() => {
    if (loadingCategorias) return { base: "", lista: [] };
    return generarCodigos({
      tipoCreacion: TIPO_CREACION,
      tipoInoculo: esComprado ? "Comprado" : tipoInoculo,
      nombreEspecie: especie,
      categorias,
      fecha,
      cantidad,
    });
  }, [tipoInoculo, especie, categorias, fecha, cantidad, loadingCategorias, esComprado]);

  const handleRegistrar = async () => {
    if (tieneErroresComposicion) {
      setAlerta({
        visible: true,
        variant: "error",
        mensaje: "Algún ingrediente excede el stock disponible. Revisa la composición.",
      });
      return;
    }
    setRegistrando(true);
    try {
      const datos = crearInoculoDTO({
        codigo: codigos.base,
        tipo: TIPO_CREACION,
        especie,
        fecha,
        cantidadFinal,
        cantidad,
        nota,
        unidad: "g",
        inoculoSeleccionado: esComprado ? { id: null, raw: { id_inoculo: null } } : inoculoSeleccionado,
        valoresComposicion,
        itemsComposicion: itemsComposicion,
      });

      datos.inoculo_usado = esComprado ? { id: null, cantidad: 0 } : { id: inoculoSeleccionado?.raw?.id_inoculo, cantidad: 0 };

      await insumosService.postInoculo(datos);
      navigate("/inoculos", {
        state: {
          alerta: {
            variante: "exito",
            mensaje: `Registro con éxito de : ${codigos.base}`,
          }
        }
      });

    } catch (error) {
      console.error("Error en el registro:", error);
      setAlerta({ visible: true, ...traducirError(error) });
    } finally {
      setRegistrando(false);
    }
  };

  return (
    <>
      <Titulo>Crear Semilla</Titulo>

      <Base margen_arriba="mt-16 md:mt-8">
        <div className="p-6 flex flex-col gap-6">

          <div className="flex flex-col lg:flex-row gap-6 items-start">

            <div className="flex flex-col gap-6 flex-1 min-w-0">
              <div className="bg-white rounded-[32px] shadow-sm border p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 flex-wrap">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                    {/* Especie */}
                    <div className="flex flex-col gap-2 w-full">
                      <Text variante="label" style={{ color: colores.gris }}>Especie</Text>
                      <SelectField
                        value={especie}
                        onChange={(e) => setEspecie(e.target.value)}
                        placeholder="Selecciona especie"
                        options={opcionesEspecies}
                        loading={loadingEspecies}
                        error={errorEspecies}
                      />
                    </div>

                    {/* Inóculo con Checkbox */}
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex justify-between items-center mb-1">
                        <Text variante="label" style={{ color: colores.gris }}>Inóculo</Text>
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-blue-600 select-none">
                          <input 
                            type="checkbox" 
                            checked={esComprado} 
                            onChange={(e) => {
                              setEsComprado(e.target.checked);
                              setInoculo(""); 
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          ¿Es comprado?
                        </label>
                      </div>
                      
                      {!esComprado ? (
                        <SelectField
                          value={inoculo}
                          onChange={(e) => setInoculo(e.target.value)}
                          placeholder="Selecciona inóculo"
                          options={opcionesInoculos}
                          loading={loadingInoculos}
                          error={errorInoculos}
                          disabled={!especie}
                        />
                      ) : (
                        <div className="h-[42px] flex items-center px-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-sm font-medium">
                          Inóculo comprado
                        </div>
                      )}
                    </div>

                    {/* Mijo */}
                    <div className="flex flex-col gap-2 w-full">
                      <Text variante="label" style={{ color: colores.gris }}>Mijo</Text>
                      <SelectField
                        value={mijo}
                        onChange={(e) => setMijo(e.target.value)}
                        placeholder="Selecciona mijo"
                        options={opcionesMijo}
                        loading={loadingInsumos}
                      />
                    </div>

                    {/* Tamaño */}
                    <div className="flex flex-col gap-2 w-full">
                      <Text variante="label" style={{ color: colores.gris }}>Tamaño</Text>
                      <SelectField
                        value={tamano}
                        onChange={(e) => setTamano(e.target.value)}
                        placeholder="Selecciona tamaño"
                        options={OPCIONES_TAMANO}
                      />
                    </div>

                  </div>
                </div>
              </div>

              <EntradaLista items={itemsComposicion} />
                <div className="bg-white rounded-[32px] shadow-sm border p-6 md:p-8 flex flex-col gap-6">
                  <div className="flex flex-col md:flex-row gap-6 w-full">

                    <div className="flex flex-col gap-3 w-full md:w-[160px] shrink-0">
                      <Text variante="medium">Cantidad</Text>
                      <InputCantidad value={cantidad} onChange={setCantidad} />
                    </div>

                    <div className="flex flex-col gap-3 flex-1">
                      <Text variante="medium">Fecha de creación</Text>
                      <InputFecha value={fecha} onChange={setFecha} />
                    </div>

                  </div>

                  <div className="flex flex-col gap-3 w-full">
                    <Text variante="medium">Notas</Text>
                    <InputNota value={nota} onChange={setNota} />
                  </div>
                  
                </div>
            </div>

            <Resumen
              especie={especie}
              codigoInoculo={codigoInoculo}
              composicion={itemsComposicion}
              codigos={codigos.lista}
              cantidad={cantidad}
            >
              <Button
                variant="registrar"
                onClick={handleRegistrar}
                disabled={registrando || !tamano || tieneErroresComposicion}
              >
                {registrando ? "Registrando..." : "Registrar"}
              </Button>
              <Button variant="cancelar" isOutline onClick={() => navigate(-1)}>
                Cancelar
              </Button>
            </Resumen>

          </div>
        </div>
      </Base>
      
      <ModalAlerta
        visible={alerta.visible}
        variante={alerta.variante}
        mensaje={alerta.mensaje}
        onClose={() => setAlerta((a) => ({ ...a, visible: false }))}
      />
    </>
  );
};

export default FormSemillas;