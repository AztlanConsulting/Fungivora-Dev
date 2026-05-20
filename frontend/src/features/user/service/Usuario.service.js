
//Verificacion de administrador usando el token 
//la razon del usuo de token es debido a como se maneja el token en el auth, que pide el token para hacer la verificacion, no lo hace via acceso a roles
const verificarAdminAPI = async () => {
    const token = localStorage.getItem("token")//obtiene el token de local storege
    const response = await fetch('/api/usuario', {
        method: "GET",
        headers: { "Authorization": token },
        cache: "no-store",
    });
    const data = await response.json();
    return data;
  }

//Obtiene todos los usuarios y guarda el token
const obtenerTodosLosUsuarios = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch('/api/usuario/lista', { 
    method: 'GET',
    headers: { "Authorization": token },
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error("No se pudo cargar la lista de usuarios");
  }

  return await response.json(); 
};

//Se encarga de manejar los usuarios y guardar el token
//Tambien verifica si el usuario es administrador
const eliminarUsuarioAPI = async (id_usuario) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`/api/usuario/eliminar/${id_usuario}`, {
    method: 'DELETE',
    headers: { "Authorization": token },
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error("No tienes permisos para eliminar o el usuario no existe.");
  }

  return await response.json();
};

export default { 
  verificarAdminAPI, 
  obtenerTodosLosUsuarios, 
  eliminarUsuarioAPI 
};
