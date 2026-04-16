import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registrarMedioLiquidoDB, obtenerAgaresBase } from "../services/micelioService";
import Base from "../componentes/base";
import Titulo from "../componentes/titulo";
import AlertaError from "../componentes/error";
import Button from "../componentes/botones";
import CampoFoto from "../componentes/campofoto";

const RegistrarMedioLiquido = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Registrar Medio Líquido | Fungívora";
  }, []);

  const [form, setForm] = useState({
    agua: "", miel: "", peptona: "", notas: "", foto: "No", fotos: []
  });

  const [agaresDisponibles, setAgaresDisponibles] = useState([]);
  const [agaresSeleccionados, setAgaresSeleccionados] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerAgaresBase()
      .then(setAgaresDisponibles)
      .catch(() => setError("Error al cargar agares base."));
  }, []);

  const set = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  // Foto 
  const handleFotos = (e) =>
    setForm((prev) => ({ ...prev, fotos: Array.from(e.target.files) }));

  const resizeFoto = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          const MAX = 800;
          let w = img.width, h = img.height;
          if (w > h) { if (w > MAX) { h = h * (MAX / w); w = MAX; } }
          else        { if (h > MAX) { w = w * (MAX / h); h = MAX; } }
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          canvas.getContext("2d").drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL(file.type));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  
  const agregarAgar = (e) => {
    const id = e.target.value;
    const agar = agaresDisponibles.find(a => a.id_micelio_sustrato === id);
    if (agar && !agaresSeleccionados.some(a => a.id_micelio_sustrato === id)) {
      setAgaresSeleccionados([...agaresSeleccionados, { ...agar, cantidadUsada: "" }]);
    }
    e.target.value = "";
  };

  const handleCantidadAgar = (id, valor) => {
    setAgaresSeleccionados(agaresSeleccionados.map(a =>
      a.id_micelio_sustrato === id ? { ...a, cantidadUsada: valor } : a
    ));
  };

  const quitarAgar = (id) => {
    setAgaresSeleccionados(agaresSeleccionados.filter(a => a.id_micelio_sustrato !== id));
  };

  const registrar = async () => {
    if (agaresSeleccionados.length === 0 || !form.agua || !form.miel) {
      setError("Por favor, completa los ingredientes y selecciona al menos un agar.");
      return;
    }

    // Redimencioa y convierte fotos a base64
    const fotosBase64 = await Promise.all(form.fotos.map(resizeFoto));
    const fotoFinal = fotosBase64.length > 0 ? fotosBase64[0] : "No";

    const payload = {
      id_usuario: "u1-11111111-1111-1111-111111111111",
      id_base: agaresSeleccionados[0].id_micelio_sustrato,
      nombre_base: agaresSeleccionados[0].tipo,
      notas: form.notas || "",
      cantidad_final: Number(form.agua) || 0,
      foto: fotoFinal,
      ingredientes: [
        { id_insumo: 1, cantidad_usada: Number(form.agua) },
        { id_insumo: 2, cantidad_usada: Number(form.miel) },
        { id_insumo: 3, cantidad_usada: Number(form.peptona) }
      ]
    };

    try {
      await registrarMedioLiquidoDB(payload);
      alert("¡Registro exitoso!");
      navigate("/inventario");
    } catch (err) {
      setError("Error en el servidor: " + err.message);
    }
  };

  return (
    <Base>
      <Titulo>Registrar Medio Líquido</Titulo>
      <AlertaError detalle={error} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">

        {/* COLUMNA IZQUIERDA: AGARES y NOTAS */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <label className="font-bold text-[#3b3fb6] text-lg">Seleccionar Agar Base</label>
            <div className="relative">
              <select
                className="w-full border-2 border-[#3b3fb6] rounded-xl px-4 py-3 bg-white outline-none appearance-none font-medium text-[#3b3fb6]"
                onChange={agregarAgar}
                defaultValue=""
              >
                <option value="" disabled>Selecciona un micelio...</option>
                {agaresDisponibles.map(a => (
                  <option key={a.id_micelio_sustrato} value={a.id_micelio_sustrato}>
                    {a.tipo} - {new Date(a.fecha_de_actualizacion).toLocaleDateString()}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-4 pointer-events-none text-[#3b3fb6]">▼</div>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              {agaresSeleccionados.map(agar => (
                <div key={agar.id_micelio_sustrato} className="flex items-center border-2 border-[#3b3fb6] rounded-2xl bg-white overflow-hidden shadow-sm">
                  <span className="flex-1 px-4 py-2 text-[#3b3fb6] font-medium truncate">{agar.tipo}</span>
                  <input
                    type="number"
                    className="w-20 px-2 py-2 text-center border-l-2 border-[#3b3fb6] outline-none font-bold text-[#3b3fb6]"
                    value={agar.cantidadUsada}
                    onChange={(e) => handleCantidadAgar(agar.id_micelio_sustrato, e.target.value)}
                    placeholder="0"
                  />
                  <span className="px-3 font-bold text-[#3b3fb6] border-l-2 border-[#3b3fb6] bg-[#f0f2ff]">g</span>
                  <button onClick={() => quitarAgar(agar.id_micelio_sustrato)} className="px-4 text-red-500 font-bold hover:bg-red-50 border-l-2 border-[#3b3fb6]">✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <label className="font-bold text-lg">Notas de lote</label>
            <textarea
              className="w-full border-2 border-[#3b3fb6] rounded-2xl p-4 h-40 outline-none focus:ring-2 ring-[#ffb81c] transition-all"
              value={form.notas}
              onChange={set("notas")}
              placeholder="Escribe detalles sobre la esterilización o el estado del micelio..."
            />
          </div>
        </div>

        {/* COLUMNA DERECHA: COMPOSICIÓN y FOTO */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 p-6 border-2 border-dashed border-[#a0a8d9] rounded-3xl bg-[#f8f9ff]">
            <h2 className="text-[#3b3fb6] font-bold italic text-xl mb-2 text-center">Composición del medio</h2>
            <div className="flex flex-col gap-3">
              {[
                { label: "Agua destilada", campo: "agua",    unidad: "ml" },
                { label: "Miel",           campo: "miel",    unidad: "g"  },
                { label: "Peptona",        campo: "peptona", unidad: "g"  }
              ].map(({ label, campo, unidad }) => (
                <div key={campo} className="flex items-center border-2 border-[#3b3fb6] rounded-2xl bg-white overflow-hidden shadow-sm">
                  <span className="flex-1 px-4 py-2 text-[#3b3fb6] font-medium">{label}</span>
                  <input
                    className="w-24 px-2 py-2 text-center border-l-2 border-[#3b3fb6] outline-none font-bold text-[#3b3fb6]"
                    value={form[campo]}
                    onChange={set(campo)}
                    placeholder="0"
                  />
                  <span className="px-3 font-bold text-[#3b3fb6] border-l-2 border-[#3b3fb6] bg-[#f0f2ff] w-14 text-center">{unidad}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CampoFoto reemplaza el div estático */}
          <CampoFoto fotos={form.fotos} onChange={handleFotos} />
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <Button variant="editar" size="md" onClick={registrar}>
          Registrar
        </Button>
      </div>
    </Base>
  );
};

export default RegistrarMedioLiquido;