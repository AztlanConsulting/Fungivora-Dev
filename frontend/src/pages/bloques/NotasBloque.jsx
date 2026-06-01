import React from "react";
import { useParams, useLocation } from "react-router-dom";
import Notas from "../../shared/components/ui/templates/Notas";
import useNotasBloques from "../../features/bloques/hooks/useNotasBloques";

const BloqueNota = () => {
    const { id_bloque } = useParams();
    const { state } = useLocation();
    const { notas, cargando, error, postNota } = useNotasBloques(id_bloque);

    return (
        <Notas
            notas={notas}
            cargando={cargando}
            error={error}
            id={id_bloque}
            codigo={state?.codigoVisual || "Bloque"}
            onAgregar={postNota}
        />
    );
};

export default BloqueNota;