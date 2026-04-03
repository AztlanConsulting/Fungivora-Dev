import { useEffect, useState } from "react";

function First_Page() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api")
      .then(res => res.json())
      .then(data => setMensaje(data.mensaje))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Pagina principal</h1>

      <p>Bienvenidx a fungivora sin nombre "aun"</p>
      
      <br></br>
        {/*<Botton para ir a usuarios*/}
        <button
        onClick={() => {
            fetch("http://localhost:5000/usuario", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }});
        }}
        >
        Registro de Usuarios
        </button>
    </div>
  );
}

export default Login;