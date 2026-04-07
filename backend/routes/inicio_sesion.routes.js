const express = require('express');
const router = express.Router();

const controller = require('../controllers/inicio_sesion.controller');
const auth = require('../middleware/auth');
const verificarRol = require('../middleware/rbac');

//Rutas para el login
router.post('/', controller.post_login);
router.get('/', controller.get_login);

//Acceder como usuario y verificar su rol
router.get('/usuario', auth, verificarRol("Administrador"), controller.get_usuario);

//Hashing de contraseñas
router.post('/hash', controller.post_hash);
router.post('/compare', controller.post_comparacion);


module.exports = router;