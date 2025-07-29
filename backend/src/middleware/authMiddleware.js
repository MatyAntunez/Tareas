const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ mensaje: 'Token inválido.' });
    req.user = user; // user debe tener id y rol
    next();
  });
}

module.exports = autenticarToken;
