import React from "react";
import { colores } from "../../components/ui/basics/Colores";
import Text from "../../components/ui/basics/Texto";

/**
 * Tarjeta de resumen cambiante para el formulario de creación de semillas.
 *
 * @param {string}   especie
 * @param {string}   codigoInoculo
 * @param {Array}    composicion
 * @param {string[]} codigos
 */
const Resumen = ({
  especie,
  codigoInoculo,
  composicion = [],
  codigos = [],
  cantidad = 1,
  cantidadDisponible = null,
  unidadCantidad = "ml",
  children,
}) => {
  const codigoUnico = codigos.length === 1 ? codigos[0] : null;
  const varioscodigos = codigos.length > 1 ? codigos : null;
  const mostrarRango = varioscodigos && varioscodigos.length > 3;

  const estiloEtiqueta = { color: colores.negro, fontWeight: 500 };

  const renderChip = (label) => (
    <div
      className="flex items-center justify-center shrink-0 min-w-[22px] h-[22px] px-1.5 rounded-full"
      style={{ backgroundColor: colores.azul + "1A" }}
    >
      <Text variante="body" as="span" style={{ color: colores.azul, fontWeight: 600 }}>
        {label}
      </Text>
    </div>
  );

  return (
    <div className="w-full lg:w-64 xl:w-72 bg-white rounded-[32px] shadow-sm border p-4 sm:p-6 flex flex-col gap-4 shrink-0 min-w-0">
      <Text variante="medium" style={{ color: colores.azul, fontWeight: 600 }}>
        Resumen
      </Text>

      <div className="flex flex-col gap-1">
        <Text variante="label" style={estiloEtiqueta}>
          {varioscodigos ? "Códigos" : "Código"}
        </Text>

        {codigoUnico && (
          <Text variante="body" style={{ color: colores.negro }}>
            {codigoUnico}
          </Text>
        )}

        {varioscodigos && !mostrarRango && (
          <div className="flex flex-col gap-1.5 mt-1">
            {varioscodigos.map((codigo, i) => (
              <div key={i} className="flex items-center gap-2">
                {renderChip(i + 1)}
                <Text variante="body" as="span" style={{ color: colores.gris }}>
                  {codigo}
                </Text>
              </div>
            ))}
          </div>
        )}

        {mostrarRango && (
          <div className="flex flex-col mt-1">
            <div className="flex items-center gap-2">
              {renderChip(1)}
              <Text variante="body" as="span" style={{ color: colores.gris }}>
                {varioscodigos[0]}
              </Text>
            </div>

            <div
              className="w-0.5 h-4 my-1 ml-2.5"
              style={{ backgroundColor: colores.azul + "40" }}
            />

            <div className="flex items-center gap-2">
              {renderChip(varioscodigos.length)}
              <Text variante="body" as="span" style={{ color: colores.gris }}>
                {varioscodigos[varioscodigos.length - 1]}
              </Text>
            </div>
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

      {(composicion.length > 0 || cantidadDisponible != null) && (
        <div className="w-full h-px" style={{ backgroundColor: colores.grisClaro }} />
      )}

      {cantidadDisponible != null && (
        <div className="flex flex-col gap-0.5">
          <Text variante="label" style={estiloEtiqueta}>Cantidad disponible</Text>
          {cantidadDisponible !== "" && Number(cantidadDisponible) > 0
            ? <Text variante="body" style={{ color: colores.negro, fontWeight: 500 }}>{cantidadDisponible} {unidadCantidad}</Text>
            : <Text variante="input">—</Text>
          }
        </div>
      )}

      {composicion.length > 0 && (
      <div className="flex flex-col gap-2">
        <Text variante="label" style={estiloEtiqueta}>Composición</Text>

        {composicion.map((item, index) => {
          const valorNum = parseFloat(String(item.value).replace(",", ".")) || 0;
          const total = item.total ?? +(valorNum * cantidad).toFixed(2);
          const hayValor = valorNum > 0;
          const excede = !!item.excedeTotal;

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
                    color: excede ? "red" : (hayValor ? colores.negro : colores.grisClaro),
                    fontWeight: hayValor ? 500 : 400,
                  }}
                >
                  {hayValor ? total : "0"} {item.unidad}
                </Text>
              </div>

              {excede && (
                <div className="pl-2">
                  <Text variante="body" as="span" style={{ color: "red", fontSize: "10px", fontWeight: 600 }}>
                    {item.mensajeErrorTotal}
                  </Text>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}

      {children && (
        <>
          <div className="w-full h-px" style={{ backgroundColor: colores.grisClaro }} />
          <div className="flex flex-col items-center gap-4">
            {children}
          </div>
        </>
      )}
    </div>
  );
};

export default Resumen;
