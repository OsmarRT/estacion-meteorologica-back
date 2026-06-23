const express = require('express');
const { health } = require('../controllers/healthController');
const authRoutes = require('./authRoutes');
const datosRoutes = require('./datosRoutes');

const router = express.Router();

router.get('/health', health);
router.use('/auth', authRoutes);
router.use('/datos', datosRoutes);

module.exports = router;