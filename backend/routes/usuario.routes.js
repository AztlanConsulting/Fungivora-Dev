const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario.controller');
const auth = require('../middleware/auth');
const verificarRol = require('../middleware/rbac');

//router.post('/anadir', auth, verificarRol(true), controller.post_registro);
//router.get('/registrar_usuario', auth, verificarRol(true), controller.get_registrar_usuario);

//Acceder como usuario y verificar su rol
router.get('/', auth, verificarRol(true), controller.get_usuario);
router.delete('/eliminar/:id_usuario', auth, verificarRol(true), controller.delete_usuario);
router.get('/lista', auth, verificarRol(true), controller.get_lista_usuarios);

module.exports = router;