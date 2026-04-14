import React from "react";
import Button from "./botones";
import "../styles/Modal.css"; 

const ModalConfirmacion = ({
  visible,
  mensaje = "¿Estás segurx?",
  onConfirm,
  onCancel,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar"
}) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{mensaje}</p>

        <div className="modal-buttons">
          <Button variant="confirmar" onClick={onConfirm}>
            {textoConfirmar}
          </Button>

          <Button variant="eliminar" onClick={onCancel}>
            {textoCancelar}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacion;