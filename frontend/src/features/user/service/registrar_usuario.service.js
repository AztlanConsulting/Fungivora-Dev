 //Asistencia de la IA para entender y como implementar estructuracion para verificarAdmin
  const verificarAdmin = async () => {
    const token = localStorage.getItem("token")
    const response = await fetch('/api/usuario/registrar_usuario', {
        method: "GET",
        headers: { "Authorization": token},
       
        cache: "no-store",
    });
    const data = await response.json();
    return data;
  };

    //Maneja los datos del nuevo usuario
    const registrarUsuario = async (nombre_usuario, correo_usuario, contrasena) => {
        const token = localStorage.getItem("token");
        const response = await fetch('/api/usuario/anadir', {
            method: 'POST',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({ nombre_usuario, correo_usuario, contrasena }),
        });
        const data = await response.json();
        return data;
};
export default { verificarAdmin, registrarUsuario };