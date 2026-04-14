import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../componentes/botones";
import CampoTexto from "../componentes/campotexto";
import SelectCampo from "../componentes/selectcampo";
import CampoFotos from "../componentes/campofoto";
import "../styles/registro.css";

const RegistrarSemilla = () => {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const semilla    = state?.semilla || null;

  const [granos,   setGranos]   = useState([]);
  const [micelios, setMicelios] = useState([]);

  const [errorMsg, setErrorMsg] = useState("");

   //formulario base
  const [form, setForm] = useState({
    rendimiento:     "",
    notas:           "",
    tipoGrano:       "",
    cantidadGrano:   "",
    miselio:         "",
    cantidadMiselio: "",
    fotos:           [],
  });

 useEffect(() => {
  const obtenerDatos = () => {
    fetch("http://localhost:5000/inventario/registrarsemilla")
      .then(res => res.json())
      .then(data => {
        if (data.granos && data.granos.length > 0) setGranos(data.granos);
        if (data.micelios && data.micelios.length > 0) setMicelios(data.micelios);
      })
      .catch(err => console.error(err));
  };
  obtenerDatos();
  const intervalo = setInterval(obtenerDatos, 5000);
  return () => clearInterval(intervalo);
}, []);

  //Creacion de Funciones
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
    if (!form.rendimiento || !form.tipoGrano || !form.cantidadGrano || !form.miselio || !form.cantidadMiselio) {
      setErrorMsg("Por favor llena todos los campos obligatorios");
      return;
    }

    if (isNaN(form.cantidadGrano) || form.cantidadGrano <= 0) {
      setErrorMsg("La cantidad de grano debe ser un número mayor a 0");
      return;
    }

    let foto = null;
    if (form.fotos.length > 0) {
      foto = await resizeFoto(form.fotos[0]);
    }

    fetch("http://localhost:5000/inventario/registrarsemilla", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_herencia:       semilla?.id_inventario     || null,
        nombre_inventario: semilla?.nombre_inventario || null,
        unidad_medida:     semilla?.unidad_medida     || null,
        rendimiento:       form.rendimiento,
        tipoGrano:         form.tipoGrano,
        cantidadGrano:     form.cantidadGrano,
        micelio:           form.miselio,
        cantidadMicelio:   form.cantidadMiselio,
        notas:             form.notas || null,
        foto,
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("Error al registrar");
      return res.json();
    })
    .then(() => {
    setErrorMsg("")
    navigate("/inventario");
    })
    .catch(()=> setErrorMsg("Error al registrar semilla, intente de nuevo")); 
  };
  //Creacion  de la Vista con CSS
  return (
    <div className="registro-screen">
      <div className="registro-contenido">
        <h1 className="registro-titulo">Registrar Semilla</h1>
        {semilla && (
          <span className="registro-seleccionada-tag">{semilla.label}</span>
        )}
        {errorMsg && (
          <div className="registro-error">
            {errorMsg}
          </div>
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
            <CampoTexto label="Cantidad" value={form.cantidadGrano} onChange={set("cantidadGrano")} type="number" />
          </div>
          <div className="registro-campo">
            <label>Miselio</label>
            <SelectCampo
              value={form.miselio}
              onChange={set("miselio")}
              placeholder="Selecciona un miselio..."
              opciones={micelios.map(m => ({ value: m.id_inventario, label: m.nombre_inventario }))}
            />
          </div>
          <div className="registro-campo">
            <CampoTexto label="Cantidad" value={form.cantidadMiselio} onChange={set("cantidadMiselio")} type="number" />
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

export default RegistrarSemilla;