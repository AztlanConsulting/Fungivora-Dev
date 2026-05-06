const express = require('express');
const router = express.Router();

const controller = require('../controllers/lotes.controller');

router.get('/', controller.get_batches);

// Ruta para crear lotes
router.post('/crear', controller.post_batch);
// Ruta para actualizar la fase de un lote
router.put('/fase', controller.actualizar_fase);

module.exports = router;