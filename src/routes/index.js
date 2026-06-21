const express = require('express');
const { health } = require('../controllers/healthController');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.get('/health', health);
router.use('/auth', authRoutes);

module.exports = router;