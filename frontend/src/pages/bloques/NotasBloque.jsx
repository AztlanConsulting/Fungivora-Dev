import React from "react";
import { useParams, useLocation } from "react-router-dom";
import Notas from "../../shared/components/ui/templates/Notas";
import useNotasBloques from "../../features/bloques/hooks/useNotasBloques";

const BloqueNota = () => {
    const { id_bloque } = useParams();
    const { state } = useLocation();
    const { notas, cargando, error } = useNotasBloques(id_bloque);

    return (
        <Notas
            notas={notas}
            cargando={cargando}
            error={error}
            id_bloque={id_bloque}
            codigoBloque={state?.codigoVisual || "Bloque"}
        />
    );
};

export default BloqueNota;