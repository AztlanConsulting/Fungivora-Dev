const express = require('express');
const router = express.Router();
const NuevoUsuarioController = require('../controllers/nuevo_usuario.controller');
const auth = require('../middleware/auth');
const verificarRol = require('../middleware/rbac');

router.post('/anadir', auth, verificarRol(true), NuevoUsuarioController.post_registro);
router.get('/registrar_usuario', auth, verificarRol(true), NuevoUsuarioController.get_registrar_usuario);

module.exports = router