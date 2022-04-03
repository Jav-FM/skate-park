const jwt = require('jsonwebtoken');

const requireAdminAuth = (req, res, next) => {
  try {
    if (!req.headers?.authorization) {
      throw new Error('No autorizado');
    }

    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      throw new Error('Formato de token no valido (utilizar Bearer)');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!decoded.email || decoded.email !== 'admin@skaterpark.com') {
        throw new Error('No eres administrador');
      }
    });

    next();
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error: error.message,
    });
  }
};

module.exports = { requireAdminAuth };
