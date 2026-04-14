import { HugeiconsIcon } from '@hugeicons/react';
import { Upload01Icon } from '@hugeicons/core-free-icons';

// boton para subir fotos al formulario
const CampoFoto = ({ fotos = [], onChange }) => {
  return (
    <div className="registro-fotos">
      <p className="registro-fotos-label">Fotos</p>
      <label className="registro-fotos-btn">
        <HugeiconsIcon icon={Upload01Icon} size={28} className="text-[#3b3fb6]" />
        <input
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={onChange}
        />
      </label>
      {fotos.length > 0 && (
        <p className="registro-fotos-count">{fotos.length} foto(s) seleccionada(s)</p>
      )}
    </div>
  );
};
export default CampoFoto;