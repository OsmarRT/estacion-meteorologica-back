const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

function getTokenFromHeader(req) {
  const authorization = req.headers.authorization || '';

  if (!authorization.toLowerCase().startsWith('bearer ')) {
    return '';
  }

  return authorization.slice(7).trim();
}

function requireAuth(req, res, next) {
  if (!jwtSecret) {
    return res.status(503).json({
      message: 'JWT no está configurado en este entorno',
    });
  }

  const token = getTokenFromHeader(req);

  if (!token) {
    return res.status(401).json({
      message: 'Token Bearer requerido',
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token invalido o expirado',
    });
  }
}

module.exports = {
  requireAuth,
};