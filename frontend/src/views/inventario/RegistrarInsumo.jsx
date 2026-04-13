import React, { useState, useEffect } from "react";

const PruebaInsumo = () => {
  // ESTADO - Declarado una sola vez
  const [categorias, setCategorias] = useState([]); 
  const [mensaje, setMensaje] = useState("");
  const [formData, setFormData] = useState({
    nombre_insumo: "",
    cantidad_inicial: "",
    stock_minimo: "",
    unidad_medida: "",
    id_categoria: "",
  });

  // Cargar categorías al entrar
  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const res = await fetch("http://localhost:5000/inventario/categorias");
        
        if (!res.ok) throw new Error("Error en el servidor");

        const data = await res.json();

        console.log("Datos recibidos del backend:", data); // Mira esto en F12        
        // Tu backend manda { status: 'success', categorias: rows }
        
        if (data && Array.isArray(data.categorias)) {
            const listaValida = Array.isArray(data.categorias) 
            ? data.categorias 
            : [data.categorias];
          setCategorias(data.categorias);
        } else {
          setCategorias([]); 
        }
      } catch (err) {
        console.error("Fallo al cargar categorías:", err);
        setCategorias([]); 
      }
    };
    obtenerCategorias();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("Enviando...");
    try {
      const res = await fetch("http://localhost:5000/inventario/crear-insumo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      res.ok ? setMensaje(" ¡Guardado con éxito!") : setMensaje(` Error: ${data.error}`);
    } catch (error) {
      setMensaje("❌ Error de conexión");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", fontFamily: "sans-serif" }}>
      <h2>Nuevo Insumo</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input name="nombre_insumo" placeholder="Nombre (ej: Agar)" onChange={handleChange} required />
        
        <select 
            name="id_categoria" // 1. Este nombre vincula el valor al formData
            onChange={handleChange} 
            required 
            value={formData.id_categoria}
            >
            <option value="">-- Selecciona Categoría --</option>
            {categorias.map((cat) => (
                <option 
                key={cat.id_categoria} 
                value={cat.id_categoria} // 2. ESTO es lo que se envía al backend (el UUID/ID)
                >
                {cat.nombre_categoria}  
                </option>
            ))}
        </select>

        <input name="cantidad_inicial" type="number" placeholder="Cantidad Inicial" onChange={handleChange} required />
        <input name="stock_minimo" type="number" placeholder="Stock Mínimo" onChange={handleChange} required />
        <input name="unidad_medida" placeholder="Unidad (g, ml, piezas)" onChange={handleChange} required />

        <button type="submit" style={{ padding: "10px", background: "#3B3FB6", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Guardar Insumo
        </button>
      </form>
      {mensaje && <p style={{ marginTop: "15px", fontWeight: "bold" }}>{mensaje}</p>}
    </div>
  );
};

export default PruebaInsumo;