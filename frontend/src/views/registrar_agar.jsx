import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../componentes/botones";
import CampoTexto from "../componentes/campotexto";
import SelectCampo from "../componentes/selectcampo";
import CampoFotos from "../componentes/campofoto";
import "../styles/registro.css";

const RegistrarAgar = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const agar      = state?.agar || null;

  const [granos, setGranos] = useState([]);

  const [form, setForm] = useState({
    rendimiento:   "",
    notas:         "",
    tipoGrano:     "",
    cantidadGrano: "",
    fotos:         [],
  });

  useEffect(() => {
    const obtenerDatos = () => {
      fetch("http://localhost:5000/inventario/registraragar")
        .then(res => res.json())
        .then(data => {
          if (data.granos && data.granos.length > 0) setGranos(data.granos);
        })
        .catch(err => console.error(err));
    };
    obtenerDatos();
    const intervalo = setInterval(obtenerDatos, 5000);
    return () => clearInterval(intervalo);
  }, []);

  const set = (campo) => (e) =>
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  const handleFotos = (e) =>
    setForm((prev) => ({ ...prev, fotos: Array.from(e.target.files) }));

  const resizeFoto = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          const MAX = 800;
          let w = img.width;
          let h = img.height;
          if (w > h) { if (w > MAX) { h = h * (MAX / w); w = MAX; } }
          else        { if (h > MAX) { w = w * (MAX / h); h = MAX; } }
          const canvas = document.createElement("canvas");
          canvas.width  = w;
          canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL(file.type));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

  const handleRegistrar = async () => {
    if (!form.rendimiento || !form.tipoGrano || !form.cantidadGrano) {
      alert("Por favor llena todos los campos obligatorios");
      return;
    }

    let foto = null;
    if (form.fotos.length > 0) {
      foto = await resizeFoto(form.fotos[0]);
    }

    fetch("http://localhost:5000/inventario/registraragar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_herencia:       agar?.id_inventario     || null,
        nombre_inventario: agar?.nombre_inventario || null,
        unidad_medida:     agar?.unidad_medida     || null,
        rendimiento:       form.rendimiento,
        tipoGrano:         form.tipoGrano,
        cantidadGrano:     form.cantidadGrano,
        notas:             form.notas || null,
        foto,
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("Error al registrar");
      return res.json();
    })
    .then(() => navigate("/inventario"))
    .catch((err) => {
      console.error("Error completo:", err);
      alert("Error al registrar agar, intente de nuevo");
    });
  };

  return (
    <div className="registro-screen">
      <div className="registro-contenido">
        <h1 className="registro-titulo">Registrar Agar</h1>
        {agar && (
          <span className="registro-seleccionada-tag">{agar.label}</span>
        )}
        <div className="registro-grid">
          <div className="registro-campo">
            <CampoTexto label="Rendimiento" value={form.rendimiento} onChange={set("rendimiento")} />
          </div>
          <div className="registro-campo">
            <CampoTexto label="Notas" value={form.notas} onChange={set("notas")} multiline />
          </div>
          <div className="registro-campo">
            <label>Tipo de grano</label>
            <SelectCampo
              value={form.tipoGrano}
              onChange={set("tipoGrano")}
              placeholder="Selecciona un grano..."
              opciones={granos.map(g => ({ value: g.id_inventario, label: g.nombre_inventario }))}
            />
          </div>
          <div className="registro-campo">
            <CampoTexto label="Cantidad" value={form.cantidadGrano} onChange={set("cantidadGrano")} />
          </div>
        </div>
        <CampoFotos fotos={form.fotos} onChange={handleFotos} />
        <div className="registro-btn-registrar">
          <Button variant="editar" onClick={handleRegistrar}>Registrar</Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrarAgar;