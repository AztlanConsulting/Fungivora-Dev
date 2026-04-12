const express = require('express');
const router = express.Router();

// Routes.js
// Inicio de sesión
const loginRoutes = require('./inicio_sesion.routes');
const pruebaRoutes = require('./prueba_db.routes');
// Inicio de sesión
const insumosRoutes = require('./insumos.routes');

// Prefijos de rutas
// Inicio de sesión
router.use('/login', loginRoutes);
router.use('/prueba', pruebaRoutes);
router.use('/insumos', insumosRoutes);


module.exports = router;