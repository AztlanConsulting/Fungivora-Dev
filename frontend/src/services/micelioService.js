// frontend/src/services/micelioService.js
const API_URL = "http://localhost:5000/api/micelio"; 

export const registrarMedioLiquidoDB = async (datos) => {
  try {
    const response = await fetch(`${API_URL}/crear-medio-liquido`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Fallo al guardar en la base de datos");
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const obtenerAgaresBase = async () => {
  try {
    const response = await fetch(`${API_URL}/agares-base`);
    if (!response.ok) throw new Error("Error al obtener agares");
    return await response.json();
  } catch (error) {
    throw error;
  }
};