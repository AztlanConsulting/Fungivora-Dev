const express = require('express');
const router = express.Router();

const controller = require('../controllers/inicio_sesion.controller');

router.get('/', controller.get_login);

router.get('/user', controller.get_user);

module.exports = router;