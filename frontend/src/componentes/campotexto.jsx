//Campo de texto

const CampoTexto = ({ label, value, onChange, placeholder = "Escribe tu entrada...", multiline = false, type = "text" }) => {
  const clase = "registro-input";

  return (
    //creacion del componente con sus props de tailwind 
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
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default CampoTexto;