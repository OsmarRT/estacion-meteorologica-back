const express = require('express');
const { health } = require('../controllers/healthController');
const authRoutes = require('./authRoutes');
const datosRoutes = require('./datosRoutes');
const otaRoutes = require('./otaRoutes');

const router = express.Router();

router.get('/health', health);
router.use('/auth', authRoutes);
router.use('/datos', datosRoutes);
router.use('/ota', otaRoutes);

module.exports = router;