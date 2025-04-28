// const jwt = require("jsonwebtoken");
// const dotenv = require("dotenv");

// dotenv.config();

// const verifyRole = (requiredRole) => {
//   return (req, res, next) => {
//     const token = req.cookies.jwt; // Obtener el token desde las cookies

//     if (!token) {
//       return res.status(401).json({ error: "Acceso no autorizado." });
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.SECRET_KEY); // Decodifica el token
//       req.user = decoded; // Adjunta los datos del usuario al objeto `req`

//       // Verificar el rol del usuario
//       if (req.user.fk_rol !== requiredRole) {
//         return res.status(403).json({ error: "Permiso denegado." });
//       }

//       next(); // Continúa con la ejecución de la ruta
//     } catch (err) {
//       return res.status(401).json({ error: "Token inválido o expirado." });
//     }
//   };
// };

// module.exports = verifyRole;


