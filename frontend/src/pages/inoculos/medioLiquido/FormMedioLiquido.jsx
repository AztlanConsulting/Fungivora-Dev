import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import SelectField   from "../../../shared/components/ui/inputs/seleccionar_texto";
import InputFecha    from "../../../shared/components/ui/inputs/input_fecha";
import InputCantidad from "../../../shared/components/ui/inputs/input_cantidad";
import InputNota     from "../../../shared/components/ui/inputs/input_nota";
import Button        from "../../../shared/components/ui/buttons/botones";

import { EntradaLista }      from "../../../features/crear_inoculos/components/seleccionar_cantidades";
import ResumenMedioLiquido   from "../../../features/crear_inoculos/components/ResumenMedioLiquido";

import useEspecies                 from "../../../features/inoculos/hooks/useEspecies";
import useCategorias               from "../../../features/crear_inoculos/hooks/useCategorias";
import useInoculoParaMedioLiquido      from "../../../features/inoculos/hooks/useInoculoparaMedioLiquido";
import useIngredientesMedioLiquido from "../../../features/crear_inoculos/hooks/useIngredientesMedioLiquido";

import {
  generarCodigos,
  normalizarTipoInoculo,
} from "../../../features/crear_inoculos/utils/generarCodigoInoculo";

import insumosService from "../../../features/crear_inoculos/services/inoculos.service";

import Titulo      from "../../../shared/components/ui/basics/titulo";
import Text        from "../../../shared/components/ui/basics/texto";
import { Base }    from "../../../shared/components/layout";
import { colores } from "../../../shared/components/ui/basics/colores";

const TIPO_CREACION = "medioLiquido";

const OPCIONES_CARBOHIDRATO = [
  { value: "miel",        label: "Miel"           },
  { value: "jarabe_maiz", label: "Jarabe de maíz" },
];

const FormMedioLiquido = () => {
  const navigate = useNavigate();

  const [especie,      setEspecie]      = useState("");
  const [inoculo,      setInoculo]      = useState("");
  const [carbohidrato, setCarbohidrato] = useState("");
  const [cantidad,     setCantidad]     = useState(1);
  const [fecha,        setFecha]        = useState({});
  const [nota,         setNota]         = useState("");
  const [enviando,     setEnviando]     = useState(false);
  const [error,        setError]        = useState(null);

  const { especies,  loading: loadingEspecies,  error: errorEspecies  } = useEspecies();
  const { opciones: inoculos, loading: loadingInoculos, error: errorInoculos } = useInoculoParaMedioLiquido(especie);
  const { categorias, loading: loadingCategorias } = useCategorias();

  const inoculoSeleccionado = (inoculos ?? []).find((ino) => ino.value === inoculo);
  const codigoInoculo       = inoculoSeleccionado?.raw?.codigo_fungivora ?? "";
  const tipoInoculo         = normalizarTipoInoculo(inoculoSeleccionado?.raw?.tipo); 
  const inoculoDisponible   = inoculoSeleccionado?.raw?.cantidad_disponible ?? 0;

  const {
    items: itemsComposicion,
    valores: valoresComposicion,
    loading: loadingInsumos,
  } = useIngredientesMedioLiquido({ carbohidrato, inoculoDisponible });

  const opcionesEspecies = especies.map((esp) => ({
    value: esp.especie,
    label: esp.especie,
  }));

  const opcionesInoculos = (inoculos ?? []).map((ino) => ({
    value: ino.value,
    label: ino.label,
  }));

  const codigos = useMemo(() => {
    if (loadingCategorias) return [];
    return generarCodigos({
      tipoCreacion:  TIPO_CREACION,
      tipoInoculo,
      nombreEspecie: especie,
      categorias,
      fecha,
      cantidad,
    });
  }, [tipoInoculo, especie, categorias, fecha, cantidad, loadingCategorias]);

  const handleRegistrar = async () => {
    setError(null);
    setEnviando(true);

    try {
      // 1. Fecha formateada a string para MySQL
      const fechaFormateada = fecha?.day && fecha?.month && fecha?.year
        ? `${fecha.year}-${String(fecha.month).padStart(2, "0")}-${String(fecha.day).padStart(2, "0")}`
        : null;

      // 2. Ingredientes con id (vienen del hook, verifica que existan)
      const ingredientes = itemsComposicion
        .filter((item) => item.id != null && item.nombre !== "Inóculo")
        .map((item) => ({
          id:       item.id,
          cantidad: parseFloat(item.value) || 0,
        }));

      // 3. inoculo_usado con id explícito o null
      const body = {
        codigo_fungivora:    codigos[0],
        tipo:                "Medio Líquido",
        especie,
        fecha:               fechaFormateada,
        cantidad_disponible: parseFloat(valoresComposicion.agua) || 0,
        nota,
        unidad:              "ml",
        stock_recomendado:   0,
        inoculo_usado: {
          id:       inoculoSeleccionado?.raw?.id_inoculo ?? null,
          cantidad: parseFloat(valoresComposicion.inoculoCant) || 0,
        },
        ingredientes,
      };
      console.log("BODY ENVIADO:", JSON.stringify(body, null, 2)); // ← agrega esto

      const res = await insumosService.crearInoculo(body);

      if (!res.success) {
        setError(res.message ?? "Error al registrar el medio líquido");
        return;
      }

      navigate(-1);

    } catch (err) {
      console.error("Error al registrar medio líquido:", err);
      setError("Error de conexión, intenta de nuevo");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <Titulo>Crear Medio Líquido</Titulo>

      <Base margen_arriba="mt-16 md:mt-8">
        <div className="p-6 flex flex-col gap-6">

          <div className="flex flex-col lg:flex-row gap-6 items-start">

            <div className="flex flex-col gap-6 flex-1 min-w-0">

              {/* Selects principales */}
              <div className="bg-white rounded-[32px] shadow-sm border p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 flex-wrap">

                  {/* Especie */}
                  <div className="flex flex-col gap-2">
                    <Text variante="label" style={{ color: colores.gris }}>Especie</Text>
                    <SelectField
                      value={especie}
                      onChange={(e) => {
                        setEspecie(e.target.value);
                        setInoculo("");
                      }}
                      placeholder="Selecciona especie"
                      options={opcionesEspecies}
                      loading={loadingEspecies}
                      error={errorEspecies}
                    />
                  </div>

                  {/* Inóculo */}
                  <div className="flex flex-col gap-2">
                    <Text variante="label" style={{ color: colores.gris }}>Inóculo</Text>
                    <SelectField
                      value={inoculo}
                      onChange={(e) => setInoculo(e.target.value)}
                      placeholder={
                        !especie
                          ? "Selecciona una especie primero"
                          : inoculos?.length === 0 && !loadingInoculos
                          ? "Sin inóculos disponibles"
                          : "Selecciona inóculo"
                      }
                      options={opcionesInoculos}
                      loading={loadingInoculos}
                      error={errorInoculos}
                      disabled={!especie || (inoculos?.length === 0 && !loadingInoculos)}
                    />
                  </div>

                  {/* Carbohidrato */}
                  <div className="flex flex-col gap-2">
                    <Text variante="label" style={{ color: colores.gris }}>Carbohidrato</Text>
                    <SelectField
                      value={carbohidrato}
                      onChange={(e) => setCarbohidrato(e.target.value)}
                      placeholder="Selecciona carbohidrato"
                      options={OPCIONES_CARBOHIDRATO}
                    />
                  </div>

                </div>
              </div>

              {/* Composición */}
              <EntradaLista items={itemsComposicion} loading={loadingInsumos} />

              {/* Cantidad, Fecha y Notas */}
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

              {/* Error de envío */}
              {error && (
                <div className="rounded-2xl px-4 py-3 text-sm" style={{ backgroundColor: "#FEE2E2", color: "#B91C1C" }}>
                  {error}
                </div>
              )}

            </div>

            {/* Panel de resumen */}
            <ResumenMedioLiquido
              especie={especie}
              codigoInoculo={codigoInoculo}
              composicion={itemsComposicion}
              codigos={codigos}
              cantidad={cantidad}
            />

          </div>

          <div className="flex justify-end gap-4 pb-8">
            <Button variant="cancelar" isOutline onClick={() => navigate(-1)} disabled={enviando}>
              Cancelar
            </Button>
            <Button variant="registrar" onClick={handleRegistrar} disabled={enviando}>
              {enviando ? "Registrando..." : "Registrar"}
            </Button>
          </div>

        </div>
      </Base>
    </>
  );
};

export default FormMedioLiquido;