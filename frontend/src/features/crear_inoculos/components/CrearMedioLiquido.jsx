import React, { useState } from "react";

import SelectField from "../../../shared/components/ui/inputs/seleccionar_texto";
import Text        from "../../../shared/components/ui/basics/texto";
import { Base }    from "../../../shared/components/layout";
import { colores } from "../../../shared/components/ui/basics/colores";

import { EntradaLista } from "./seleccionar_cantidades";
import ResumenSemilla   from "./ResumenSemilla";

import useEspecies                 from "../../inoculos/hooks/useEspecies";
import useInoculoParaSemillas      from "../../inoculos/hooks/useInoculoprarasemillas";
import useIngredientesMedioLiquido from "../hooks/useIngredientesMedioLiquido";

const OPCIONES_CARBOHIDRATO = [
  { value: "miel",        label: "Miel" },
  { value: "jarabe_maiz", label: "Jarabe de maíz" },
];

const CrearMedioLiquido = () => {
  const [especie, setEspecie] = useState("");
  const [inoculo, setInoculo] = useState("");
  const [carbohidrato, setCarbohidrato] = useState("");

  const { especies, loading: loadingEspecies, error: errorEspecies } = useEspecies();
  const { opciones: inoculos, loading: loadingInoculos, error: errorInoculos } = useInoculoParaSemillas(especie);

  const inoculoSeleccionado = (inoculos ?? []).find((ino) => ino.codigo === inoculo);
  const inoculoDisponible = inoculoSeleccionado?.raw?.cantidad_disponible ?? 0;
  const codigoInoculo = inoculoSeleccionado?.codigo ?? "";

  const { items: itemsComposicion, loading: loadingInsumos } = useIngredientesMedioLiquido({
    carbohidrato,
    inoculoDisponible,
  });

  const opcionesEspecies = especies.map((esp) => ({
    value: esp.especie,
    label: esp.especie,
  }));

  const opcionesInoculos = (inoculos ?? []).map((ino) => ({
    value: ino.codigo,
    label: ino.label,
  }));

  return (
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
                  <Text variante="label" style={{ color: colores.gris }}>Carbohidrato</Text>
                  <SelectField
                    value={carbohidrato}
                    onChange={(e) => setCarbohidrato(e.target.value)}
                    placeholder="Selecciona carbohidrato"
                    options={OPCIONES_CARBOHIDRATO}
                    loading={loadingInsumos}
                  />
                </div>

              </div>
            </div>

            <EntradaLista items={itemsComposicion} />

          </div>

          <ResumenSemilla
            especie={especie}
            codigoInoculo={codigoInoculo}
            composicion={itemsComposicion}
          />

        </div>

      </div>
    </Base>
  );
};

export default CrearMedioLiquido;
