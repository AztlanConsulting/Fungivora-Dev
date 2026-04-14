import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CampoTexto from "../componentes/camp_txt"; 
import Button from "../componentes/botones";
import { registrarMedioLiquidoDB, obtenerAgaresBase } from "../services/micelioService";

const RegistrarMedioLiquido = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Registrar Medio Líquido | Fungívora";
  }, []);

  const [form, setForm] = useState({
    agua: "",
    miel: "",
    peptona: "",
    notas: "",
    foto: "No"
  });

  const [agaresDisponibles, setAgaresDisponibles] = useState([]);
  const [agaresSeleccionados, setAgaresSeleccionados] = useState([]); 
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerAgaresBase();
        setAgaresDisponibles(data);
      } catch (err) {
        setError("Error al cargar agares base.");
      }
    };
    cargarDatos();
  }, []);

  const handleInputChange = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
  };

  const agregarAgar = (e) => {
    const id = e.target.value;
    const agar = agaresDisponibles.find(a => a.id_micelio_sustrato === id);
    if (agar && !agaresSeleccionados.some(a => a.id_micelio_sustrato === id)) {
      setAgaresSeleccionados([...agaresSeleccionados, { ...agar, cantidadUsada: "" }]);
    }
    e.target.value = ""; 
  };

  const handleCantidadAgar = (id, valor) => {
    setAgaresSeleccionados(agaresSeleccionados.map(agar => 
      agar.id_micelio_sustrato === id ? { ...agar, cantidadUsada: valor } : agar
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
    
    const payload = {
        id_usuario: 1, // Cambiar por el ID real cuando tengas Auth
        // Importante: id_base es lo que el modelo espera
        id_base: agaresSeleccionados[0].id_micelio_sustrato, 
        tipo: 'Medio Líquido',
        notas: form.notas || "",
        // Convertimos a número para evitar errores de tipos en SQL
        cantidad_final: Number(form.agua) || 0, 
        foto: form.foto || "No",
        // Mapeamos ingredientes como arreglo para el loop del controller
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
    <div className="flex flex-col p-4 md:p-8 bg-[#fdfaf5] min-h-screen items-center text-gray-800">
      <div className="w-full max-w-5xl">
        
        <h1 className="text-3xl md:text-4xl font-bold text-[#3b3fb6] mb-10">
          Registrar Medio Líquido
        </h1>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
          
          {/* COLUMNA IZQUIERDA: AGARES */}
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

              {/* LISTA DE AGARES (ESTILO CONCORDANTE) */}
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

            {/* NOTAS */}
            <div className="flex flex-col gap-2 mt-4">
              <label className="font-bold text-lg">Notas de lote</label>
              <textarea 
                className="w-full border-2 border-[#3b3fb6] rounded-2xl p-4 h-40 outline-none focus:ring-2 ring-[#ffb81c] transition-all"
                value={form.notas}
                onChange={handleInputChange("notas")}
                placeholder="Escribe detalles sobre la esterilización o el estado del micelio..."
              />
            </div>
          </div>

          {/* COLUMNA DERECHA: COMPOSICIÓN */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 p-6 border-2 border-dashed border-[#a0a8d9] rounded-3xl bg-[#f8f9ff]">
              <h2 className="text-[#3b3fb6] font-bold italic text-xl mb-2 text-center">Composición del medio</h2>
              
              <div className="flex flex-col gap-3">
                {/* FILA AGUA (ESTILO IGUAL AL DE AGARES) */}
                <div className="flex items-center border-2 border-[#3b3fb6] rounded-2xl bg-white overflow-hidden shadow-sm">
                  <span className="flex-1 px-4 py-2 text-[#3b3fb6] font-medium">Agua destilada</span>
                  <input 
                    className="w-24 px-2 py-2 text-center border-l-2 border-[#3b3fb6] outline-none font-bold text-[#3b3fb6]"
                    value={form.agua}
                    onChange={handleInputChange("agua")}
                    placeholder="0"
                  />
                  <span className="px-3 font-bold text-[#3b3fb6] border-l-2 border-[#3b3fb6] bg-[#f0f2ff] w-14 text-center">ml</span>
                </div>

                {/* FILA MIEL */}
                <div className="flex items-center border-2 border-[#3b3fb6] rounded-2xl bg-white overflow-hidden shadow-sm">
                  <span className="flex-1 px-4 py-2 text-[#3b3fb6] font-medium">Miel</span>
                  <input 
                    className="w-24 px-2 py-2 text-center border-l-2 border-[#3b3fb6] outline-none font-bold text-[#3b3fb6]"
                    value={form.miel}
                    onChange={handleInputChange("miel")}
                    placeholder="0"
                  />
                  <span className="px-3 font-bold text-[#3b3fb6] border-l-2 border-[#3b3fb6] bg-[#f0f2ff] w-14 text-center">g</span>
                </div>

                {/* FILA PEPTONA */}
                <div className="flex items-center border-2 border-[#3b3fb6] rounded-2xl bg-white overflow-hidden shadow-sm">
                  <span className="flex-1 px-4 py-2 text-[#3b3fb6] font-medium">Peptona</span>
                  <input 
                    className="w-24 px-2 py-2 text-center border-l-2 border-[#3b3fb6] outline-none font-bold text-[#3b3fb6]"
                    value={form.peptona}
                    onChange={handleInputChange("peptona")}
                    placeholder="0"
                  />
                  <span className="px-3 font-bold text-[#3b3fb6] border-l-2 border-[#3b3fb6] bg-[#f0f2ff] w-14 text-center">g</span>
                </div>
              </div>
            </div>

            {/* SECCIÓN FOTOGRAFÍA */}
            <div className="mt-4">
              <label className="font-bold text-lg block mb-3">Agregar fotografía</label>
              <div className="flex items-center gap-4 border-2 border-[#3b3fb6] border-dotted rounded-2xl p-6 bg-white justify-center cursor-pointer hover:bg-indigo-50 transition-colors group">
                <span className="text-gray-400 group-hover:text-[#3b3fb6] font-medium">Haz clic para subir o arrastra una imagen +</span>
              </div>
            </div>
          </div>

        </div>

        {/* BOTÓN REGISTRAR */}
        <div className="flex justify-center mt-12 pb-16">
          <button 
            onClick={registrar}
            className="bg-[#ffb81c] text-white font-bold px-16 py-4 rounded-full text-xl shadow-lg hover:bg-[#e5a617] hover:scale-105 transition-all active:scale-95"
          >
            Registrar
          </button>
        </div>

      </div>
    </div>
  );
};

export default RegistrarMedioLiquido;