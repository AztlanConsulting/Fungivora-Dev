const express = require('express');
const router = express.Router();
const NuevoUsuarioController = require('../controllers/nuevo_usuario.controller');

router.post('/anadir', NuevoUsuarioController.post_registro );

module.exports = router