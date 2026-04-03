import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ProtectedRoute({ children, rolPermitido }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.rol !== rolPermitido) {
      return <Navigate to="/first" />;
    }

    return children;

  } catch (error) {
    return <Navigate to="/" />;
  }
}

export default ProtectedRoute;