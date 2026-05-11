const express = require('express');
const router = express.Router();

const loginRoutes = require('./inicio_sesion.routes');
const pruebaRoutes = require('./prueba_db.routes');
const inventarioRoutes = require('./inventario.routes');
const usuarioRoutes = require('./usuario.routes');
const inoculoRoutes = require('./inoculo.routes');
const categoriaRoutes = require('./categoria.routes');
const lotesRoutes = require('./lotes.routes');
const bloqueRoutes = require('./bloque.routes');

// Inicio de sesión
router.use('/login', loginRoutes);
router.use('/usuario', usuarioRoutes);
router.use('/prueba', pruebaRoutes);
router.use('/inventario', inventarioRoutes);
router.use('/inoculos', inoculoRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/lotes', lotesRoutes);
router.use('/bloques', bloqueRoutes);

module.exports = router;