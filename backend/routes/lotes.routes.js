const express = require('express');
const router = express.Router();

const controller = require('../controllers/lotes.controller');

router.get('/', controller.get_batches);

// Ruta para crear lotes
router.post('/crear', controller.post_batch);

// Obtener todas los sustratos de categorias
router.get('/sustratos', controller.get_sustratos);

// Obtener todas las ubicacionesde categorias
router.get('/ubicaciones', controller.get_ubicaciones);

module.exports = router;