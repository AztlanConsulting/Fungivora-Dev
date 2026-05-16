import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import SelectField from "../../../shared/components/ui/inputs/seleccionar_texto";
import InputFecha from "../../../shared/components/ui/inputs/input_fecha";
import InputCantidad from "../../../shared/components/ui/inputs/input_cantidad";
import InputNota from "../../../shared/components/ui/inputs/input_nota";
import Button from "../../../shared/components/ui/buttons/botones";

import { EntradaLista } from "../../../features/crear_inoculos/components/seleccionar_cantidades";
import ResumenSemilla from "../../../features/crear_inoculos/components/ResumenSemilla";
import insumosService from "../../../features/crear_inoculos/services/inoculos.service";
import { BOLSAS } from "../../../features/crear_inoculos/types/inoculos.type";

import useEspecies from "../../../features/inoculos/hooks/useEspecies";
import useCategorias from "../../../features/crear_inoculos/hooks/useCategorias";
import useInoculoParaSemillas from "../../../features/inoculos/hooks/useInoculoprarasemillas";
import useIngredientesSemilla from "../../../features/crear_inoculos/hooks/useIngredientesSemilla";

import {
  generarCodigos,
  normalizarTipoInoculo,
} from "../../../features/crear_inoculos/utils/generarCodigoInoculo";

import Titulo from "../../../shared/components/ui/basics/titulo";
import Text from "../../../shared/components/ui/basics/texto";
import { Base } from "../../../shared/components/layout";
import { colores } from "../../../shared/components/ui/basics/colores";

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
  const [mijo, setMijo] = useState("");
  const [tamano, setTamano] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [fecha, setFecha] = useState({});
  const [nota, setNota] = useState("");

  const { especies, loading: loadingEspecies, error: errorEspecies } = useEspecies();
  const { opciones: inoculos, loading: loadingInoculos, error: errorInoculos } = useInoculoParaSemillas(especie);
  const { categorias, loading: loadingCategorias } = useCategorias();

  const inoculoSeleccionado = (inoculos ?? []).find((ino) => ino.codigo === inoculo);
  const tipoInoculo = normalizarTipoInoculo(inoculoSeleccionado?.raw?.tipo);
  const inoculoDisponible = inoculoSeleccionado?.raw?.cantidad_disponible ?? 0;
  const codigoInoculo = inoculoSeleccionado?.codigo ?? "";
  const cantidadFinal = BOLSAS[tamano] ?? cantidad;

  const {
    items: itemsComposicion,
    valores: valoresComposicion,
    opcionesMijo,
    loading: loadingInsumos,
  } = useIngredientesSemilla({
    inoculoDisponible,
    tipoMijo: mijo,
    codigoInoculo,
    tamano,
    tipoInoculo,
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
    if (loadingCategorias) return [];
    return generarCodigos({
      tipoCreacion: TIPO_CREACION,
      tipoInoculo,
      nombreEspecie: especie,
      categorias,
      fecha,
      cantidad,
    });
  }, [tipoInoculo, especie, categorias, fecha, cantidad, loadingCategorias]);

  const handleRegistrar = async () => {
    try {
      /* Molde creado por archivo type para mandar correctamente al endpoint */
      for(const codigo in codigos) {
        const datos = {
          codigo_fungivora: codigos[codigo],
          tipo: TIPO_CREACION,
          especie: especie,
          fecha: `${fecha.year}-${String(fecha.month).padStart(2, "0")}-${String(fecha.day).padStart(2, "0")}`,
          cantidad_disponible: cantidadFinal,
          unidad: "gr",
          stock_recomendado: 100,
          nota: nota,

          inoculo_usado: {
            id: inoculoSeleccionado?.raw?.id_inoculo ?? null,
            cantidad: Number(valoresComposicion.cantInoculo) || 0,
          },

          ingredientes: itemsComposicion
            .filter((item) => item.tipo === "ingrediente" && item.id != null)
            .map((ing) => ({
              id: ing.id,
              cantidad: Number(ing.value) || 0,
          })),
        };

        console.log("Datos hacia backend:", datos);

        const respuesta = await insumosService.postSemilla(datos);

        /* TODO: hay que cambiar esto por un mini Popup y un redirect a biblioteca genetica */
        alert("Semilla registrada con exito!");
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      alert(`Error: ${error.message}`);
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

                  <div className="flex flex-col gap-2">
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

                  <div className="flex flex-col gap-2">
                    <Text variante="label" style={{ color: colores.gris }}>Inóculo</Text>
                    <SelectField
                      value={inoculo}
                      onChange={(e) => setInoculo(e.target.value)}
                      placeholder="Selecciona inóculo"
                      options={opcionesInoculos}
                      loading={loadingInoculos}
                      error={errorInoculos}
                      disabled={!especie}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Text variante="label" style={{ color: colores.gris }}>Mijo</Text>
                    <SelectField
                      value={mijo}
                      onChange={(e) => setMijo(e.target.value)}
                      placeholder="Selecciona mijo"
                      options={opcionesMijo}
                      loading={loadingInsumos}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
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

              <EntradaLista items={itemsComposicion} />

              <div className="bg-white rounded-[32px] shadow-sm border p-6 md:p-8 flex flex-col gap-6">

                <div className="flex flex-col md:flex-row gap-8 items-start flex-wrap">
                  <div className="flex flex-col gap-3">
                    <Text variante="medium">Cantidad</Text>
                    <InputCantidad value={cantidad} onChange={setCantidad} />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Text variante="medium">Fecha de creación</Text>
                    <InputFecha value={fecha} onChange={setFecha} />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Text variante="medium">Notas</Text>
                  <InputNota value={nota} onChange={setNota} />
                </div>

              </div>
            </div>

            <ResumenSemilla
              especie={especie}
              codigoInoculo={codigoInoculo}
              composicion={itemsComposicion}
              codigos={codigos}
              cantidad={cantidad}
            />

          </div>

          <div className="flex justify-end gap-4 pb-8">
            <Button variant="cancelar" isOutline onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button variant="registrar" onClick={handleRegistrar}>
              Registrar
            </Button>
          </div>

        </div>
      </Base>
    </>
  );
};

export default FormSemillas;