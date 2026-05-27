import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import SelectField from "../../../shared/components/ui/inputs/SeleccionarTexto";
import InputFecha from "../../../shared/components/ui/inputs/InputFecha";
import InputNota from "../../../shared/components/ui/inputs/InputNota";
import Button from "../../../shared/components/ui/buttons/Botones";
import ModalAlerta from "../../../shared/components/ui/popups/ModalAlerta";
import Text from "../../../shared/components/ui/basics/Texto";
import { Base } from "../../../shared/components/layout";
import { colores } from "../../../shared/components/ui/basics/Colores";

import { EntradaLista } from "../../../shared/crear-inoculos/components/SeleccionarCantidades";
import Resumen from "../../../shared/crear-inoculos/components/Resumen";
import insumosService from "../../../shared/crear-inoculos/services/inoculos.service";
import { cantMedioLiquido } from "../../../shared/crear-inoculos/types/inoculos.types";
import { crearInoculoDTO, crearInoculoCompradoDTO } from "../../../shared/crear-inoculos/dto/crearInoculoDto";
import Input from "../../../shared/components/ui/inputs/InputTexto";
import { traducirError } from "../../../shared/utils/traducirError";

import useEspecies from "../../inoculos/hooks/useEspecies";
import useCategorias from "../../../shared/crear-inoculos/hooks/useCategorias";
import useInoculo from "../../../shared/crear-inoculos/hooks/useInoculo";
import useIngredientesMedioLiquido from "../hooks/useIngredientesMedioLiquido";

import {
  generarCodigos,
  normalizarTipoInoculo,
} from "../../../shared/crear-inoculos/utils/generarCodigoInoculo";

const TIPO_CREACION = "medioLiquido";    // clave interna (prefijo + filtro de inóculo)
const TIPO_DB = "medio liquido";   // valor literal que se guarda en la columna `tipo`

// El medio líquido siempre se crea como una sola unidad (un solo matraz por registro).
const REPETICIONES = 1;

const OPCIONES_CARBOHIDRATO = [
  { value: "miel", label: "Miel" },
  { value: "jarabe_maiz", label: "Jarabe de maíz" },
];

const FormMedioLiquido = () => {
  const navigate = useNavigate();

  const [especie, setEspecie] = useState("");
  const [inoculo, setInoculo] = useState("");
  const [carbohidrato, setCarbohidrato] = useState("");
  const [esComprado, setEsComprado] = useState(false);
  const [cantidadComprada, setCantidadComprada] = useState("");

  const hoy = new Date();
  const [fecha, setFecha] = useState({
    day: String(hoy.getDate()).padStart(2, "0"),
    month: String(hoy.getMonth() + 1).padStart(2, "0"),
    year: String(hoy.getFullYear()),
  });
  const [nota, setNota] = useState("");

  const [registrando, setRegistrando] = useState(false);
  const [alerta, setAlerta] = useState({ visible: false, variante: "exito", mensaje: "" });

  const { especies, loading: loadingEspecies, error: errorEspecies } = useEspecies();
  const { opciones: inoculos, loading: loadingInoculos, error: errorInoculos } = useInoculo(especie, TIPO_CREACION);
  const { categorias, loading: loadingCategorias } = useCategorias();

  const inoculoSeleccionado = esComprado ? null : (inoculos ?? []).find((ino) => ino.codigo === inoculo);
  const tipoInoculo = normalizarTipoInoculo(inoculoSeleccionado?.raw?.tipo);
  const inoculoDisponible = inoculoSeleccionado?.raw?.cantidad_disponible ?? 0;
  const codigoInoculo = inoculoSeleccionado?.codigo ?? "";

  const {
    items: itemsComposicion,
    valores: valoresComposicion,
    tieneErrores: tieneErroresComposicion,
    loading: loadingInsumos,
  } = useIngredientesMedioLiquido({ carbohidrato, inoculoDisponible, tipoInoculo, codigoInoculo });

  const cantInoculo = parseFloat(String(valoresComposicion?.cantInoculo ?? "").replace(/,/g, "")) || 0;

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
      tipoInoculo: esComprado ? null : tipoInoculo,
      nombreEspecie: especie,
      categorias,
      fecha,
      cantidad: REPETICIONES,
    });
  }, [tipoInoculo, especie, categorias, fecha, loadingCategorias, esComprado]);

  const handleRegistrar = async () => {
    if (!esComprado && tieneErroresComposicion) {
      setAlerta({
        visible: true,
        variante: "error",
        mensaje: "Algún ingrediente excede el stock disponible. Revisa la composición.",
      });
      return;
    }
    setRegistrando(true);
    try {
      const datos = esComprado
        ? crearInoculoCompradoDTO({
            codigo: codigos.base,
            tipo: TIPO_DB,
            especie,
            fecha,
            cantidadDisponible: cantidadComprada,
            nota,
            unidad: "ml",
          })
        : crearInoculoDTO({
            codigo: codigos.base,
            tipo: TIPO_DB,
            especie,
            fecha,
            cantidadFinal: cantMedioLiquido,
            cantidad: REPETICIONES,
            nota,
            unidad: "ml",
            inoculoSeleccionado,
            valoresComposicion,
            itemsComposicion,
          });

      await insumosService.postInoculo(datos);
      navigate("/inoculos", {
        state: {
          alerta: {
            variante: "exito",
            mensaje: `Registro con éxito de: ${codigos.base}`,
          },
        },
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
      <Base margen_arriba="mt-16 md:mt-8">
        <div className="p-3 sm:p-6 flex flex-col gap-6">

          <div className="flex flex-col lg:flex-row gap-6 items-start">

            <div className="flex flex-col gap-6 flex-1 min-w-0">

              <div className="bg-white rounded-[32px] shadow-sm border p-4 sm:p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 flex-wrap">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

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

                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Text variante="label" style={{ color: colores.gris }}>Inóculo</Text>
                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={esComprado}
                            onChange={(e) => {
                              setEsComprado(e.target.checked);
                              setInoculo("");
                            }}
                            className="cursor-pointer"
                            style={{ accentColor: colores.azul }}
                          />
                          <Text variante="label" style={{ color: colores.azul, fontWeight: 600 }}>
                            ¿Es comprado?
                          </Text>
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
                        <div
                          className="h-[42px] flex items-center px-4 rounded-xl text-sm font-medium"
                          style={{
                            backgroundColor: colores.azul + "12",
                            border: `1px solid ${colores.azul}33`,
                            color: colores.azul,
                          }}
                        >
                          Inóculo comprado
                        </div>
                      )}
                    </div>

                    {!esComprado && (
                      <div className="flex flex-col gap-2 md:col-span-1">
                        <Text variante="label" style={{ color: colores.gris }}>Carbohidrato</Text>
                        <SelectField
                          value={carbohidrato}
                          onChange={(e) => setCarbohidrato(e.target.value)}
                          placeholder="Selecciona carbohidrato"
                          options={OPCIONES_CARBOHIDRATO}
                          loading={loadingInsumos}
                        />
                      </div>
                    )}

                  </div>
                </div>
              </div>

              {!esComprado && <EntradaLista items={itemsComposicion} />}

              <div className="bg-white rounded-[32px] shadow-sm border p-4 sm:p-6 md:p-8 flex flex-col gap-6">

                {esComprado && (
                  <div className="flex flex-col gap-3">
                    <Text variante="medium">Cantidad disponible</Text>
                    <div className="flex items-center gap-3">
                      <Input
                        variante="numero"
                        numeroTipo="decimal"
                        placeholder="0"
                        value={cantidadComprada}
                        onChange={(e) => setCantidadComprada(e.target.value)}
                        roundedClass="rounded-xl"
                      />
                      <Text variante="label" style={{ color: colores.negro }}>ml</Text>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Text variante="medium">Fecha de creación</Text>
                  <InputFecha value={fecha} onChange={setFecha} />
                </div>

                <div className="flex flex-col gap-3">
                  <Text variante="medium">Notas</Text>
                  <InputNota value={nota} onChange={setNota} />
                </div>

              </div>
            </div>

            <Resumen
              especie={especie}
              codigoInoculo={esComprado ? "" : codigoInoculo}
              composicion={esComprado ? [] : itemsComposicion}
              codigos={codigos.lista}
              cantidadDisponible={esComprado ? cantidadComprada : null}
              unidadCantidad="ml"
            >
              <Button
                variant="registrar"
                fullWidth
                onClick={handleRegistrar}
                disabled={
                  registrando ||
                  !especie ||
                  (esComprado
                    ? (!cantidadComprada || Number(cantidadComprada) <= 0)
                    : (!inoculo || !carbohidrato || cantInoculo <= 0 || tieneErroresComposicion))
                }
              >
                {registrando ? "Registrando..." : "Registrar"}
              </Button>
              <Button variant="cancelar" fullWidth isOutline onClick={() => navigate(-1)}>
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

export default FormMedioLiquido;