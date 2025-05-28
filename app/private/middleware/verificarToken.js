const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.cookies.jwt;  // Tomamos el token desde la cookie llamada "jwt"

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, usuario) => { // uso SECRET_KEY del .env
    if (err) {
      return res.status(403).json({ mensaje: 'Token inválido' });
    }

    req.usuario = usuario;
    next();
  });
};

module.exports = verificarToken;
