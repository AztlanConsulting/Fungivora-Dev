// frontend/src/services/micelioService.js
export const crearMedioLiquido = async (datos) => {
    const response = await fetch('http://localhost:3000/api/micelio/crear-medio-liquido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    return await response.json();
};