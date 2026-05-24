import api from '../../../shared/utils/api'

const loginService = async (usuario, password) => {
  const response = await api.post('/login', { 
    nombre_usuario: usuario,
    contrasena: password 
  });
  return response.data;
};

export default loginService;