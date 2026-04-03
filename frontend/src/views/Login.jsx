import { useEffect, useState } from "react";

function Login() {
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
        <h1>Login</h1>

        <p>Usuario</p>
        <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
        <p>Contraseña</p>
        <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <br></br>
        {/*<Botton para entrar al sistema*/}
        <button
        onClick={() => {
            fetch("http://localhost:5000/first", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }});
        }}
        >
        Enviar
        </button>
        </div>
    );
}