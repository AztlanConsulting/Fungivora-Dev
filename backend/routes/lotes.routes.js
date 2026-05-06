const express = require('express');
const router = express.Router();

const controller = require('../controllers/lotes.controller');

router.get('/', controller.get_batches);

// Ruta para crear lotes
router.post('/crear', controller.post_batch);

module.exports = router;