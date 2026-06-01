/**
 * Normaliza un texto para comparaciones de búsqueda:
 * minúsculas → quita acentos (NFD) → quita guiones y espacios.
 * Se aplica por igual al término buscado y a los campos comparados.
 *
 * @param {*} valor - Valor a normalizar (se convierte a string).
 * @returns {string} Texto normalizado.
 */
const normalizarBusqueda = (valor) =>
    String(valor ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[-\s]/g, "");

export default normalizarBusqueda;
