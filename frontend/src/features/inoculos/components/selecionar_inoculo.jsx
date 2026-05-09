// frontend/src/features/inoculos/components/
import React from 'react';
import SelectField from '../../../shared/components/ui/inputs/seleccionar_texto';
import useInoculoParaSemilla from '../hooks/useInoculoprarasemillas';

/**
 * Campo de selección de inóculo madre para el formulario de semillas.
 * Se habilita y filtra automáticamente según la especie elegida en el form.
 *
 * @param {object}   props
 * @param {string}   props.especie   - Especie seleccionada en el formulario (controla el filtro).
 * @param {number}   props.value     - id_inoculo actualmente seleccionado.
 * @param {function} props.onChange  - Callback onChange del select nativo (e.target.value = id_inoculo).
 * @param {function} props.onRawChange - (opcional) Recibe el objeto completo del inóculo seleccionado.
 */
const SelectInoculo = ({ especie, value, onChange, onRawChange }) => {
    const { opciones, loading, error } = useInoculoParaSemilla(especie);

    const sinEspecie = !especie;
    const sinOpciones = !loading && !error && especie && opciones.length === 0;

    const handleChange = (e) => {
        onChange(e);
        if (onRawChange) {
            const seleccionado = opciones.find(
                (op) => String(op.value) === String(e.target.value)
            );
            onRawChange(seleccionado?.raw ?? null);
        }
    };

    const placeholder = sinEspecie
        ? 'Selecciona una especie primero'
        : sinOpciones
        ? 'Sin inóculos disponibles para esta especie'
        : 'Selecciona inóculo';

    return (
        <SelectField
            label="Inóculo"
            value={value}
            onChange={handleChange}
            options={opciones}
            placeholder={placeholder}
            loading={loading}
            error={error}
            disabled={sinEspecie || sinOpciones || loading}
        />
    );
};

export default SelectInoculo;