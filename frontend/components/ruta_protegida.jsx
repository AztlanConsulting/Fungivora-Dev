import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/*
* ruta_protegida
Mediante el token tener o no acceso a las rutas
Metodo que bloquea la entrada a otras rutas sin haber tenido acceso antes
@param children (rutas hijas)
*/
function ruta_protegida({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);
    
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/" />;
    }

    return children;

  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/" />;
  }
}

export default ruta_protegida;