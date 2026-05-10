const express = require('express');
const router = express.Router();

const controller = require('../controllers/lotes.controller');

router.get('/', controller.get_batches);

// Ruta para crear lotes
router.post('/crear', controller.post_batch);
// Ruta para actualizar la fase de un lote
router.put('/fase', controller.actualizar_fase);

// Obtener todas los sustratos de categorias
router.get('/sustratos', controller.get_sustratos);

// Obtener todas las ubicacionesde categorias
router.get('/ubicaciones', controller.get_ubicaciones);

// Obtener todos los inoculos activos
router.get('/especies', controller.get_inoculos_activos);

module.exports = router;