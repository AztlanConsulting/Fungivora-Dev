const express = require('express');
const router = express.Router();
const controller = require('../controllers/inventario.controller');

// Obtener la vista de inventario
router.get('/', controller.get_inventory);

// Obtener todas las categorías
router.get('/categorias', controller.get_categorias);

// Obtener todas las unidades de categorias
router.get('/unidades', controller.get_unidades);

// Crear un nuevo insumo 
router.post('/crear-insumo', controller.post_crear_insumo);

// Actualizar cantidad
router.post('/update-cantidad', controller.post_update_cantidad);

module.exports = router;