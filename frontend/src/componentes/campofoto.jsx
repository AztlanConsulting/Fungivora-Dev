import { HugeiconsIcon } from '@hugeicons/react';
import { Upload01Icon } from '@hugeicons/core-free-icons';

const CampoFoto = ({ fotos = [], onChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-black text-base md:text-3xl">Fotos</p>
      <label className="w-[72px] h-[72px] border-[2.5px] border-[#3b3fb6] rounded-[1rem] bg-white cursor-pointer flex items-center justify-center transition-colors hover:bg-[#eceffe]">
        <HugeiconsIcon icon={Upload01Icon} size={28} className="text-[#3b3fb6]" />
        <input type="file" accept="image/*" multiple className="hidden" onChange={onChange} />
      </label>
      {fotos.length > 0 && (
        <p className="text-[0.8rem] text-[#3b3fb6]">{fotos.length} foto(s) seleccionada(s)</p>
      )}
    </div>
  );
};
export default CampoFoto;