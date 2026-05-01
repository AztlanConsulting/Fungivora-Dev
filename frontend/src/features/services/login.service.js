import api from '../../shared/utils/api'

const loginService = {
    login: (nombre_usuario, contrasena) => 
        api.post('login', { nombre_usuario, contrasena })
}

export default loginService