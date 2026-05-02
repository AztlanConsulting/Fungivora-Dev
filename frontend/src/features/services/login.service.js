import api from '../../shared/utils/api'

const loginService = async (usuario, password) => {
  const response = await axios.post('/login', { // La ruta de donde va dicha información (ruta front)
    nombre_usuario: usuario,
    contrasena: password 
  });
  return response.data;
};

export default loginService