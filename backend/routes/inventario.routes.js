const express = require('express');
const router = express.Router();

const controller = require('../controllers/inventario.controller');

//Obtener la vista de inventario
router.get('/', controller.get_inventory);

//Obtener todas las categorías
router.get('/categorias', controller.get_categorias);

//Crear un nuevo
// router.post('/crear-insumo', controller.post_crear_insumo);

module.exports = router;