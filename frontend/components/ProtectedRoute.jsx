import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, rolPermitido }) {
  const rol = localStorage.getItem("rol");

  if (rol !== rolPermitido) {
    return <Navigate to="/first" />;
  }

  return children;
}

export default ProtectedRoute;