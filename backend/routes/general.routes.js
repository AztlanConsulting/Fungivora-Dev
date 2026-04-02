const express = require('express');
const router = express.Router();

// Routes.js
// Inicio de sesión
const loginRoutes = require('./inicio_sesion.routes');

// Prefijos de rutas
// Inicio de sesión
router.use('/login', loginRoutes);

module.exports = router;