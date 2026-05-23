import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import SelectField from "../../../shared/components/ui/inputs/SeleccionarTexto";
import InputFecha from "../../../shared/components/ui/inputs/InputFecha";
import InputCantidad from "../../../shared/components/ui/inputs/input_cantidad";
import InputNota from "../../../shared/components/ui/inputs/input_nota";
import Button from "../../../shared/components/ui/buttons/Botones";
import ModalAlerta from "../../../shared/components/ui/popups/ModalAlerta";

import { EntradaLista } from "../../crear-medio/components/SeleccionarCantidades";
import ResumenSemilla from "../../crear-medio/components/ResumenSemilla";
import insumosService from "../../crear-medio/services/inoculos.service";
import { crearInoculoDTO } from "../../crear-medio/dto/crearInoculoDto";
import { traducirError } from "../../../shared/utils/traducirError";

import useEspecies from "../../inoculos/hooks/useEspecies";
import useCategorias from "../../crear-medio/hooks/useCategorias";
import useInoculo from "../../crear-medio/hooks/useInoculo";
import useIngredientesAgar from "../../crear-medio/hooks/useIngredientesAgar";

import {
  generarCodigos,
  normalizarTipoInoculo,
} from "../../crear-medio/utils/generarCodigoInoculo";

import Titulo from "../../../shared/components/ui/basics/Titulo";
import Text from "../../../shared/components/ui/basics/Texto";
import { Base } from "../../../shared/components/layout";
import { colores } from "../../../shared/components/ui/basics/Colores";
import { cantAgar } from "../../crear-medio/types/inoculos.type";

const TIPO_CREACION = "agar";

const FormAgar = () => {
  const navigate = useNavigate();

  const [especie, setEspecie] = useState("");
  const [inoculo, setInoculo] = useState("");
  const [cantidad, setCantidad] = useState(1);
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

  const inoculoSeleccionado = (inoculos ?? []).find((ino) => ino.codigo === inoculo);
  const tipoInoculo = normalizarTipoInoculo(inoculoSeleccionado?.raw?.tipo);
  const inoculoDisponible = inoculoSeleccionado?.raw?.cantidad_disponible ?? 0;
  const codigoInoculo = inoculoSeleccionado?.codigo ?? "";

  const {
    items: itemsComposicion,
    valores: valoresComposicion,
    loading: loadingInsumos,
  } = useIngredientesAgar({ inoculoDisponible, codigoInoculo, tipoInoculo });

  // Cantidad de inóculo a usar (parseada — acepta coma decimal del input)
  const cantInoculo = parseFloat(String(valoresComposicion?.cantInoculo ?? "").replace(",", ".")) || 0;

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
      tipoInoculo,
      nombreEspecie: especie,
      categorias,
      fecha,
      cantidad,
    });
  }, [tipoInoculo, especie, categorias, fecha, cantidad, loadingCategorias]);

  const resetForm = () => {
    setEspecie("");
    setInoculo("");
    setCantidad(1);
    setFecha({
      day: String(hoy.getDate()).padStart(2, "0"),
      month: String(hoy.getMonth() + 1).padStart(2, "0"),
      year: String(hoy.getFullYear()),
    });
    setNota("");
  };

  const handleRegistrar = async () => {
    setRegistrando(true);
    try {
      const datos = crearInoculoDTO({
        codigo: codigos.base,
        tipo: TIPO_CREACION,
        especie,
        fecha,
        cantidadFinal: cantAgar.agar,
        cantidad,
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
      <Titulo>Crear Agar</Titulo>

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

                </div>
              </div>

              <EntradaLista items={itemsComposicion} repeticiones={cantidad} />

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
              codigos={codigos.lista}
              cantidad={cantidad}
            />

          </div>

          <div className="flex justify-end gap-4 pb-8">
            <Button variant="cancelar" isOutline onClick={() => navigate(-1)}>
              Cancelar
            </Button>
            <Button
              variant="registrar"
              onClick={handleRegistrar}
              disabled={registrando || !inoculo || !cantidad || cantidad < 1 || cantInoculo <= 0}
            >
              {registrando ? "Registrando ..." : "Registrar"}
            </Button>
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

export default FormAgar;