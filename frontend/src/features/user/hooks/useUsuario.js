import { useState, useEffect } from 'react';
import usuarioService from '../service/usuario.service';
import { useNavigate } from 'react-router-dom';


export const useUsuario = () => {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [idUsuarioActual, setIdUsuarioActual] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const inicializarPantalla = async () => {
        const token = localStorage.getItem("token");
        if(!token){
        navigate("/login", { replace: true });
        return
        }
        try{
            const payload = JSON.parse(atob(token.split(".")[1]))
            setIdUsuarioActual(payload.id)
        } catch (error){
            console.error("token invalido", error)
        }
      // Preguntamos a la API quiénes somos
      try {
        await usuarioService.verificarAdminAPI();
        setEsAdmin(true); 
      } catch (error) {
        setEsAdmin(false); 
      }

      // Traemos la lista de la base de datos
      try {
        const datosDB = await usuarioService.obtenerTodosLosUsuarios();
        setListaUsuarios(datosDB); 
      } catch (error) {
        console.error("Error al traer usuarios:", error);
      }

      setCargando(false);
    };
    inicializarPantalla();
  }, [navigate]);

  // Controlador del botón de borrar
  const borrarUsuario = async (id_usuario_eliminar) => {
    if (id_usuario_eliminar === idUsuarioActual){
        throw new Error ("No te puedes Eliminarte")
    }

    await usuarioService.eliminarUsuarioAPI(id_usuario_eliminar);
    setListaUsuarios((listaAnterior) => 
        listaAnterior.filter(u => u.id_usuario !== id_usuario_eliminar)
    );
};

  return { listaUsuarios, esAdmin, cargando, idUsuarioActual, borrarUsuario };
};