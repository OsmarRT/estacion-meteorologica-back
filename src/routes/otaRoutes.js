const express = require('express');
const multer = require('multer');
const { subirBin } = require('../controllers/otaController');
const { requireAuth } = require('../middlewares/authMiddleware');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
});

router.post('/upload', requireAuth, upload.single('file'), subirBin);

module.exports = router;