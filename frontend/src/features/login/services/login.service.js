import api from '../../../shared/utils/api';

const loginService = {
  login: async (usuario, password) => {
    
    const response = await api.post('/login', { 
      nombre_usuario: usuario,
      contrasena: password 
    });
    
    return response; 
  }
};

export default loginService;