 //Asistencia de la IA para entender y como implementar estructuracion para verificarAdmin
  const verificarAdmin = async () => {
    const token = localStorage.getItem("token")//obtiene el token de local storege
    const response = await fetch('/api/usuario/registrar_usuario', {
        method: "GET",
        headers: { "Authorization": token},//toma la autorizacion del token que usara backend
       
        cache: "no-store",
    });
    const data = await response.json();
    return data;
  };

    //Maneja los datos del nuevo usuario y su verificacion para el backend
    const registrarUsuario = async (nombre_usuario, correo_usuario, contrasena) => {
        const token = localStorage.getItem("token"); //Guarda el token
        const response = await fetch('/api/usuario/anadir', {
            method: 'POST',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,//respuesta del token para verificar si el usuario esta autorizado que va a usar el backend
            },
            body: JSON.stringify({ nombre_usuario, correo_usuario, contrasena }),
        });
        const data = await response.json();
        return data;
};
export default { verificarAdmin, registrarUsuario };