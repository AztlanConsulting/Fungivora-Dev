import React, { useState, useEffect } from "react";
import Titulo from "../../componentes/titulo";
import Base from "../../componentes/base";
import CampoTexto from "../../componentes/input_titulo";
import Button from "../../componentes/botones";
import AlertaError from "../../componentes/error";

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
        const res = await fetch("/api/inventario/categorias");

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
      const res = await fetch("/api/inventario/crear-insumo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      res.ok ? setMensaje(" ¡Guardado con éxito!") : setMensaje(` Error: ${data.error}`);
    } catch (error) {
      setMensaje("Error de conexión");
    }
  };

  const unidades = [
    { id: "g", nombre: "Gramos" },
    { id: "ml", nombre: "Mililitros" },
    { id: "pz", nombre: "Piezas" },
    { id: "kg", nombre: "Kilogramos" },
    { id: "l", nombre: "Litros" }
  ];

  return (
    <Base margen_arriba="mt-8 md:mt-[vh]">
      <Titulo>Crear Insumo</Titulo>
      <AlertaError
        detalle={mensaje}
        esExito={mensaje.includes("éxito")}
      />
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:w-3/4">
            <CampoTexto
              texto_titulo="Nombre"
              id_campo="nombre_insumo"
              atributo={formData.nombre_insumo}
              onChange={handleChange}
              texto_relleno="Nombre (ej: Agar)"
            />
          </div>

          <div className="md:w-3/4">
            {/* Campo de Selección (Categorías) */}
            <CampoTexto
              esSelect={true}
              texto_titulo="Categoría"
              id_campo="id_categoria"
              nombre_campo="nombre_categoria"
              atributo={formData.id_categoria}
              onChange={handleChange}
              opciones={categorias}
              texto_relleno="-- Selecciona una categoría --"
            />
          </div>

        </div>
        <br className="hidden md:block" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:w-3/4">
            <CampoTexto
              texto_titulo="Cantidad Inicial"
              id_campo="cantidad_inicial"
              atributo={formData.cantidad_inicial}
              onChange={handleChange}
              tipo={"number"}
            />
          </div>
          <div className="md:w-3/4">
            <CampoTexto
              texto_titulo="Stock Mínimo"
              id_campo="stock_minimo"
              atributo={formData.stock_minimo}
              onChange={handleChange}
              tipo={"number"}
            />
          </div>

          <div className="md:w-3/4">
            <CampoTexto
              esSelect={true}
              texto_titulo="Unidad de Medida"
              id_campo="id"
              nombre_campo="nombre"
              atributo={formData.id}
              onChange={handleChange}
              opciones={unidades}
              texto_relleno="Unidad (g, ml, piezas)"
            />
          </div>

        </div>
        <br />

        <Button type="submit" size="md">
          Guardar
        </Button>
      </form>

    </Base>
  );
};

export default PruebaInsumo;