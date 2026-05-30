const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const verificarRol = require('../middleware/rbac');

router.post('/crear', verificarRol(true), usuarioController.post_crear_usuario);

router.get('/listar', verificarRol(true), usuarioController.get_usuarios);

router.post('/eliminar', verificarRol(true), usuarioController.post_eliminar_usuario);

module.exports = router;