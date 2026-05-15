const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario.controller');
const auth = require('../middleware/auth');
const verificarRol = require('../middleware/rbac');

router.post('/anadir', auth, verificarRol(true), controller.post_registro);
router.get('/registrar_usuario', auth, verificarRol(true), controller.get_registrar_usuario);

module.exports = router;