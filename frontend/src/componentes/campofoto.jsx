const CampoFoto = ({ fotos = [], onChange }) => {
  return (
    <div className="registro-fotos">
      <p className="registro-fotos-label">Fotos</p>
      <label className="registro-fotos-btn">
        <svg
          width="28" height="28" viewBox="0 0 24 24"
          fill="none" stroke="#3b3fb6" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
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