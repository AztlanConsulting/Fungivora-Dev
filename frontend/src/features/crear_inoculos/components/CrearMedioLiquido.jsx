import React, { useState } from "react";

import SelectField from "../../../shared/components/ui/inputs/seleccionar_texto";
import Text        from "../../../shared/components/ui/basics/texto";
import { Base }    from "../../../shared/components/layout";
import { colores } from "../../../shared/components/ui/basics/colores";

import useEspecies            from "../../inoculos/hooks/useEspecies";
import useInoculoParaSemillas from "../../inoculos/hooks/useInoculoprarasemillas";

const CrearMedioLiquido = () => {
  const [especie, setEspecie] = useState("");
  const [inoculo, setInoculo] = useState("");

  const { especies, loading: loadingEspecies, error: errorEspecies } = useEspecies();
  const { opciones: inoculos, loading: loadingInoculos, error: errorInoculos } = useInoculoParaSemillas(especie);

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
      </div>
    </Base>
  );
};

export default CrearMedioLiquido;