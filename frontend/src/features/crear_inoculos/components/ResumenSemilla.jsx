import React from "react";
import { colores } from "../../../shared/components/ui/basics/colores";
import Text from "../../../shared/components/ui/basics/texto";

/**
 * Tarjeta de resumen cambiante para el formulario de creación de semillas.
 *
 * @param {string}   especie       
 * @param {string}   codigoInoculo 
 * @param {Array}    composicion   
 * @param {string[]} codigos       
 */
const ResumenSemilla = ({
  especie,
  codigoInoculo,
  composicion = [],
  codigos = [],
  cantidad = 1,
}) => {
  const codigoUnico   = codigos.length === 1 ? codigos[0] : null;
  const varioscodigos = codigos.length > 1   ? codigos.slice(1)    : null;


  const estiloEtiqueta = { color: colores.negro, fontWeight: 500 };

  return (
    <div
      className="w-full lg:w-64 xl:w-72 bg-white rounded-[32px] shadow-sm border p-6 flex flex-col gap-4"
      style={{ flexShrink: 0 }}
    >
      <Text variante="medium" style={{ color: colores.azul, fontWeight: 600 }}>
        Resumen
      </Text>

      <div className="flex flex-col gap-1">
        <Text variante="label" style={estiloEtiqueta}>
          {varioscodigos ? "Códigos" : "Código"}
        </Text>

        {codigoUnico && (
          <Text variante="body" style={{ color: colores.negro, fontFamily: "monospace" }}>
            {codigoUnico}
          </Text>
        )}

        {varioscodigos && (
          <div className="flex flex-col gap-1.5 mt-1">
            {varioscodigos.map((codigo, i) => (
              <div key={i} className="flex items-center gap-2">
                <Text
                  variante="body"
                  as="span"
                  style={{
                    backgroundColor: colores.azul + "1A",
                    color: colores.azul,
                    fontWeight: 600,
                    borderRadius: "9999px",
                    width: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </Text>
                <Text variante="body" as="span" style={{ color: colores.gris, fontFamily: "monospace" }}>
                  {codigo}
                </Text>
              </div>
            ))}
          </div>
        )}

        {codigos.length === 0 && (
          <Text variante="input">—</Text>
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <Text variante="label" style={estiloEtiqueta}>Especie</Text>
        {especie
          ? <Text variante="body" style={{ color: colores.gris }}>{especie}</Text>
          : <Text variante="input">—</Text>
        }
      </div>

      <div className="flex flex-col gap-0.5">
        <Text variante="label" style={estiloEtiqueta}>Inóculo</Text>
        {codigoInoculo
          ? <Text variante="body" style={{ color: colores.gris }}>{codigoInoculo}</Text>
          : <Text variante="input">—</Text>
        }
      </div>

      <div className="w-full h-[1px]" style={{ backgroundColor: colores.grisClaro }} />

      <div className="flex flex-col gap-2">
        <Text variante="label" style={estiloEtiqueta}>Composición</Text>

        {composicion.map((item, index) => {
          const valorNum = parseFloat(String(item.value).replace(",", ".")) || 0;
          const total    = +(valorNum * cantidad).toFixed(2);
          const hayValor = valorNum > 0;

          return (
            <div key={index} className="flex flex-col gap-0.5">
              <Text variante="body" as="span" style={{ color: colores.gris }}>
                {item.nombre}:
              </Text>

              <div className="flex items-center justify-between pl-2">
                {cantidad > 1 ? (
                  <Text
                    variante="body"
                    as="span"
                    style={{
                      color: hayValor ? colores.grisMedio : colores.grisClaro,
                      fontSize: "12px",
                    }}
                  >
                    {hayValor ? valorNum : "0"} × {cantidad}
                  </Text>
                ) : (
                  <span />
                )}

                <Text
                  variante="body"
                  as="span"
                  style={{
                    color: hayValor ? colores.negro : colores.grisClaro,
                    fontWeight: hayValor ? 500 : 400,
                  }}
                >
                  {hayValor ? total : "0"} {item.unidad}
                </Text>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResumenSemilla;