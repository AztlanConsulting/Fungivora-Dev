const express = require('express');
const router = express.Router();

const controller = require('../controllers/inicio_sesion.controller');
const verificarRol = require('../middleware/rbac');

router.get('/', controller.get_login);
router.post('/login', controller.post_login);

router.get('/usuario', verificarRol("Administrador"), controller.get_usuario);

//Hashing de contraseñas
router.post('/hash', controller.post_hash);
router.post('/compare', controller.post_comparacion);


module.exports = router;