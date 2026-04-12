const express = require('express');
const router = express.Router();

const controller = require('../controllers/insumos.controller');
const auth = require('../middleware/auth');
const verificarRol = require('../middleware/rbac');

//Obtener todas las categorías
router.get('/categorias', controller.get_categorias);

//Crear un nuevo
//router.post('/crear-insumo', controller.post_crear_insumo);


module.exports = router;