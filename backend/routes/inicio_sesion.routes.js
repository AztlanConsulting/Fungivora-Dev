const express = require('express');
const router = express.Router();

const controller = require('../controllers/inicio_sesion.controller');

router.get('/', controller.get_login);

//Hashing de contraseñas
router.get('/usuario', controller.get_usuario);
router.post('/hash', controller.post_hash);
router.post('/compare', controller.post_comparacion);


module.exports = router;