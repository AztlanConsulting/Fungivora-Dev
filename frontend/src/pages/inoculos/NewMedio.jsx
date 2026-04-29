import React, { useState } from "react";
import Button from "../../shared/components/ui/buttons/botones";
import { useNavigate } from "react-router-dom";

const RegistrarMedioLiquido = () => {
  const navigate = useNavigate();

  // 1. Estado del formulario
  const [form, setForm] = useState({
    agarBase: "",
    cantidadFinal: "",
    agua: "",
    miel: "",
    peptona: "",
    notas: "",
    foto: "No"
  });

  // 2. Estado para errores de validación
  const [error, setError] = useState("");

  const handleInputChange = (campo) => (e) => {
    setForm({ ...form, [campo]: e.target.value });
    if (error) setError(""); // Limpia el error cuando el usuario vuelve a escribir
  };

  // 3. Lógica para la Prueba de Interfaz: Validación de campos vacíos
  const validarYRegistrar = () => {
    const { agarBase, cantidadFinal, agua, miel, peptona } = form;

    if (!agarBase || !cantidadFinal || !agua || !miel || !peptona) {
      setError("El sistema no permite el registro: por favor rellena todos los campos obligatorios.");
      return;
    }

    setError("");
    console.log("Datos validados correctamente:", form);

    // Aquí es donde harás el fetch a tu base de datos después
    alert("¡Validación exitosa! Los datos están listos para ser guardados.");
    // navigate("/first"); // Ejemplo de redirección tras éxito
  };

  return (
    <div className="flex flex-col p-4 md:p-8 bg-[#fdfaf5] min-h-screen items-center">

      <div className="w-full max-w-5xl flex flex-col">

        <h1 className="text-2xl md:text-4xl font-bold text-[#3b3fb6] mb-8 md:mb-10 text-center md:text-left">
          Registrar Medio Líquido
        </h1>

        {/* Alerta de Error - Prueba de Interfaz */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg shadow-sm animate-fade-in">
            <p className="font-bold">Error de validación</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 mb-10">

          {/* COLUMNA IZQUIERDA: Insumos y Trazabilidad */}
          <div className="flex flex-col gap-6">

            {/* Selector de Agar Base con flecha interna */}
            <div className="flex flex-col gap-1">
              <label className="text-black font-bold text-base">Agar Base</label>
              <div className="relative w-full group">
                <select
                  className={`w-full appearance-none border-2 rounded-xl px-4 py-2 text-sm text-[#3b3fb6] bg-white outline-none cursor-pointer transition-all pr-10 ${error && !form.agarBase ? "border-red-500 bg-red-50" : "border-[#3b3fb6] focus:border-[#ffb81c]"
                    }`}
                  value={form.agarBase}
                  onChange={handleInputChange("agarBase")}
                >
                  <option value="" disabled>Selecciona un Agar base...</option>
                  <option value="1">Agar Extracto de Malta (MEA) - Lote #01</option>
                  <option value="2">Agar Papa Dextrosa (PDA) - Lote #04</option>
                </select>

                {/* Flecha indicadora DENTRO del select */}
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#3b3fb6] group-focus-within:text-[#ffb81c]">
                  <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Recuadro de composición (Ingredientes para descuento automático) */}
            <div className="flex flex-col gap-4 p-5 border-2 border-dashed border-[#a0a8d9] rounded-2xl bg-[#f8f9ff]">
              <h2 className="text-[#3b3fb6] font-bold italic text-sm md:text-base mb-2">
                Composición del medio (Ingredientes)
              </h2>

            </div>

            {/* Apartado de Fotos (Sin recuadros blancos extra) */}
            <div className="flex flex-col gap-3">
              <label className="text-black font-bold text-base">¿Incluir fotos?</label>
              <div className="flex items-center justify-between md:justify-start md:gap-10 py-1">
                <div className="flex gap-8">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="foto"
                      checked={form.foto === "Si"}
                      onChange={() => setForm({ ...form, foto: "Si" })}
                      className="w-5 h-5 accent-[#008755]"
                    />
                    <span className="font-medium group-hover:text-[#008755] transition-colors">Si</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="foto"
                      checked={form.foto === "No"}
                      onChange={() => setForm({ ...form, foto: "No" })}
                      className="w-5 h-5 accent-[#ed2025]"
                    />
                    <span className="font-medium group-hover:text-[#ed2025] transition-colors">No</span>
                  </label>
                </div>

                {/* Botón de carga de archivos */}
                <button className="border-2 border-[#3b3fb6] p-2 rounded-xl text-[#3b3fb6] hover:bg-[#3b3fb6] hover:text-white transition-all shadow-sm active:scale-95">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: Datos finales y notas */}
          <div className="flex flex-col gap-6">

          </div>

        </div>

        {/* BOTÓN DE ACCIÓN: Centrado al final */}
        <div className="flex justify-center w-full mt-6 pb-10">
          <Button variant="editar" onClick={validarYRegistrar}>
            Registrar Medio
          </Button>
        </div>

      </div>
    </div>
  );
};

export default RegistrarMedioLiquido;