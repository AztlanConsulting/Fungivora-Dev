import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Titulo from "../../shared/components/ui/basics/titulo"; 
import Text from "../../shared/components/ui/basics/texto"; 
import Base from "../../shared/components/layout/base"; 

function First_Page() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let rol = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      rol = decoded.rol;
    } catch (error) {
      console.error("Token inválido");
    }
  }

  return (
    <div className="min-h-screen">
      <Titulo>Pagina Principal</Titulo>
    </div>
  );
}

export default First_Page;