const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

router.post('/crear', usuarioController.post_crear_usuario);

router.get('/listar', usuarioController.get_usuarios);

module.exports = router;