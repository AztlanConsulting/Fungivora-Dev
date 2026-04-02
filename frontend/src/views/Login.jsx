import { useEffect, useState } from "react";

function Login() {
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api")
      .then(res => res.json())
      .then(data => setMensaje(data.mensaje))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Login</h1>

      <p>Millis was here</p>
      <p>Escucher a STRAY KIDS para una mejor vida</p>
    </div>
  );
}

export default Login;