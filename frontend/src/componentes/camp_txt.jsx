const CampoTexto = ({ label, value, onChange, placeholder = "Escribe tu entrada...", multiline = false }) => {
  const clase = "w-full border-2 border-[#3b3fb6] rounded-xl px-3 py-2 text-sm text-[#3b3fb6] bg-white outline-none placeholder-[#a0a8d9] placeholder:italic focus:border-[#ffb81c]";

  return (
    <div className="flex flex-col gap-1">
      <label className="text-black font-bold text-base">{label}</label>
      {multiline ? (
        <textarea
          /* Se agregaron los backticks (``) aquí abajo */
          className={`${clase} resize-none h-20`} 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          className={clase}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default CampoTexto;

{/*
  USO:
  <CampoTexto label="Rendimiento" value={form.rendimiento} onChange={set("rendimiento")} />
  <CampoTexto label="Notas" value={form.notas} onChange={set("notas")} multiline />
*/}