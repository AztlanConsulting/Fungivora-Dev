const SelectCampo = ({ opciones = [], value, onChange, placeholder = "Selecciona..." }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="registro-input registro-select"
    >
      <option value="" disabled>{placeholder}</option>
      {opciones.map((op) => (
        <option key={op.value} value={op.value}>{op.label}</option>
      ))}
    </select>
  );
};

export default SelectCampo;