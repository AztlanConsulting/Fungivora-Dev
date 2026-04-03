import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

    const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre_usuario: usuario,
        contrasena: password,
      }),
    });

    const data = await res.json();

    localStorage.setItem("rol", data.rol);
    navigate("/first");
  };

  return (
    <div>
      <h1>Login</h1>

      <p>Usuario</p>
      <input onChange={(e) => setUsuario(e.target.value)} />

      <p>Contraseña</p>
      <input type="password" onChange={(e) => setPassword(e.target.value)} />

      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}

export default Login;