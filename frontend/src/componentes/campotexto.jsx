const CampoTexto = ({ label, value, onChange, placeholder = "Escribe tu entrada...", multiline = false }) => {
  const clase = "registro-input";

  return (
    <div className="registro-campo">
      <label>{label}</label>
      {multiline ? (
        <textarea
          className={`${clase} registro-textarea`}
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