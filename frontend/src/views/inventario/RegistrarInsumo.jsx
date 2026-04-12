import React, { useState } from "react";

const PruebaInsumo = () => {
  // 1. Estado para el formulario (coincide con tu req.body)
  const [formData, setFormData] = useState({
    nombre_insumo: "",
    cantidad_inicial: "",
    stock_minimo: "",
    unidad_medida: "",
    id_categoria: "", // Asegúrate de usar un ID real de tu DB para probar
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("Enviando...");

    try {
      // 2. Llamada al POST (usa el puerto de tu backend, ej: 5000)
      const res = await fetch("http://localhost:5000/inventario/crear-insumo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("✅ ¡Éxito!: " + JSON.stringify(data));
      } else {
        setMensaje("❌ Error: " + (data.error || data.message));
      }
    } catch (error) {
      setMensaje("❌ Error de conexión: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Prueba de Registro de Insumos</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
        
        <input name="nombre_insumo" placeholder="Nombre (ej: Agar)" onChange={handleChange} required />
        <input name="cantidad_inicial" type="number" placeholder="Cantidad Inicial" onChange={handleChange} required />
        <input name="stock_minimo" type="number" placeholder="Stock Mínimo" onChange={handleChange} required />
        <input name="unidad_medida" placeholder="Unidad (g, ml, kg)" onChange={handleChange} required />
        <input name="id_categoria" placeholder="ID Categoría (UUID)" onChange={handleChange} required />

        <button type="submit" style={{ padding: "10px", cursor: "pointer", background: "#4CAF50", color: "white", border: "none" }}>
          Enviar al Backend
        </button>
      </form>

      {mensaje && (
        <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", background: "#f9f9f9" }}>
          <strong>Resultado:</strong>
          <pre>{mensaje}</pre>
        </div>
      )}
    </div>
  );
};

export default PruebaInsumo;