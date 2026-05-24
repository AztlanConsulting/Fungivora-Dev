/**
 * Convierte un Error en { variante, mensaje } listo para pasarle a ModalAlerta.
 * Si el código no se reconoce, cae al default genérico.
 *
 * @param {Error|null|undefined} error
 * @returns {{ variante: "exito" | "error" | "advertencia", mensaje: string }}
 */
export const traducirError = (error) => {
  switch (error?.message) {

    case "FAILED_FETCH":
      return { variante: "error", mensaje: "No hay conexión con el servidor." };

    case "TIMEOUT":
      return { variante: "error", mensaje: "El servidor está tardando demasiado en responder." };

    case "STOCK_INSUFICIENTE":
      return { variante: "advertencia", mensaje: "El stock es insuficiente" };
    
    case "CODIGO_DUPLICADO":
      return { variante: "advertencia", mensaje: "Ya existe un inóculo con ese código." };
    
    case "DATOS_INVALIDOS":
      return { variante: "advertencia", mensaje: "Hay datos faltantes o inválidos en el formulario." };

    case "ERROR_SERVIDOR":
      return { variante: "error", mensaje: "Hubo un problema en el servidor. Intenta más tarde." };

    default:
      return { variante: "error", mensaje: "Ocurrió un error" };
  }
};
