const express = require('express');
const router = express.Router();

const controller = require('../controllers/lotes.controller');

router.get('/', controller.get_batches);

module.exports = router;