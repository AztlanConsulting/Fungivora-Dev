import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon } from '@hugeicons/core-free-icons';

//creacion del componente con sus props de tailwind y exportacion de iconos
const SelectCampo = ({ opciones = [], value, onChange, placeholder = "Selecciona..." }) => {
  return (
    <div className = "relative">
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
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
       <HugeiconsIcon icon={ArrowDown01Icon} size={18} className="text-[#3b3fb6]" />
      </div>
    </div>
  );
};

export default SelectCampo;