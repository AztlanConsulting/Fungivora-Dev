import api from '../../../shared/utils/api'

const pruebaDbService = {
    getEstres: () => api.get('prueba/estres')
}

export default pruebaDbService