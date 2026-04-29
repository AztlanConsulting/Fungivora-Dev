import { useEffect, useState } from "react";

function User() {
  const [mensaje, setMensaje] = useState("");
  const [texto, setTexto] = useState("");

  useEffect(() => {
    fetch("/api/status")
      .then(res => res.json())
      .then(data => setMensaje(data.mensaje))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>User</h1>

      {/*<p>{mensaje}</p>*/}
      <p>Escribir contraseña</p>
      <input
        type="text"
        placeholder="contraseña"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      <br></br>
      {/*<Botton para guardar la contraseña*/}
      <button
        onClick={() => {
          fetch("/api/hash", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ contrasena: texto }),
          });
        }}
      >
        Guardar contraseña
      </button>

      <br></br>
      {/*<Botton para comparar la contraseña guardada*/}
      <button
        onClick={() => {
          fetch("/api/compare", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ contrasena: texto }),
          })
            .then(res => res.json())
            .then(data => console.log(data));
        }}
      >
        Comparar contraseña
      </button>
    </div>
  );
}

export default User;