import { useEffect, useState } from "react";

function User() {
  const [mensaje, setMensaje] = useState("");
  const [texto, setTexto] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api")
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

        <button
        onClick={() => {
            fetch("http://localhost:5000/hash", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ password: texto }),
            })
            .then(res => res.json())
            .then(data => console.log("Hash:", data.hash))
            .catch(err => console.error(err));
        }}
        >
        Enviar
        </button>
    </div>
  );
}

export default User;