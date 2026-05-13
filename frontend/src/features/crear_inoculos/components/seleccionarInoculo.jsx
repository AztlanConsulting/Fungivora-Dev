import React, { useState } from 'react';
import SelectField from '../../../shared/components/ui/inputs/seleccionar_texto';

/**
 * Componente que demuestra cómo usar SelectField
 * Este es un ejemplo de cómo componer componentes en React
 */
const SeleccionarInoculo = () => {
  // Estado para guardar el valor seleccionado
  const [inoculoSeleccionado, setInoculoSeleccionado] = useState('');

  // Opciones del select (estructura: {label: lo que se ve, value: lo que se guarda})
  const opcionesInoculos = [
    { label: 'Grano', value: 'grano' },
    { label: 'Líquido', value: 'liquido' },
    { label: 'Agar', value: 'agar' },
    { label: 'Cultivo Madre', value: 'cultivo_madre' },
  ];

  // Manejador de cambio
  const handleChange = (e) => {
    console.log('Inóculo seleccionado:', e.target.value);
    setInoculoSeleccionado(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2>Seleccionar Inóculo</h2>

      {/* Uso del componente SelectField */}
      <SelectField
        value={inoculoSeleccionado}
        onChange={handleChange}
        placeholder="Elige un tipo de inóculo"
        options={opcionesInoculos}
        label="Tipo de Inóculo"
        size="amplio"
      />

      {/* Mostrar el valor seleccionado */}
      {inoculoSeleccionado && (
        <div className="p-3 bg-green-100 rounded-lg">
          Has seleccionado: <strong>{inoculoSeleccionado}</strong>
        </div>
      )}
    </div>
  );
};

export default SeleccionarInoculo;