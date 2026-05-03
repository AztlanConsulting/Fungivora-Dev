const express = require('express');
const router = express.Router();

const loginRoutes = require('./inicio_sesion.routes');
const pruebaRoutes = require('./prueba_db.routes');
const inventarioRoutes = require('./inventario.routes');
const inoculoRoutes = require('./inoculo.routes');
const categoriaRoutes = require('./categoria.routes')

// Inicio de sesión
router.use('/login', loginRoutes);
router.use('/prueba', pruebaRoutes);
router.use('/inventario', inventarioRoutes);
router.use('/inoculos', inoculoRoutes);
router.use('/categorias', categoriaRoutes);

module.exports = router;