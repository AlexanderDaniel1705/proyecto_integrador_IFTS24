const jwt = require("jsonwebtoken"); // Importa el módulo 'jsonwebtoken', que permite la creación y verificación de tokens JWT.
const dotenv = require("dotenv"); // Importa 'dotenv' para cargar variables de entorno desde un archivo .env.

dotenv.config(); // Carga las variables de entorno definidas en el archivo .env, permitiendo acceder a 'SECRET_KEY'.

// Middleware para verificar el rol del usuario
const verifyRole = (requiredRoles) => {
  return (req, res, next) => {
    const token = req.cookies.jwt; // Obtiene el token JWT desde las cookies del usuario.

    if (!token) { 
      // Si no hay token en las cookies, responde con un código 401 (No autorizado).
      return res.status(401).json({ error: "Acceso no autorizado: Token no proporcionado." });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY); 
      // Verifica y decodifica el token usando la clave secreta almacenada en las variables de entorno.
      
      req.user = decoded; 
      // Adjunta los datos del usuario extraídos del token al objeto 'req', permitiendo su uso en rutas posteriores.
      console.log("Datos del usuario decodificado:", req.user);
    //    // Validar que req.user existe y que fk_rol es un string válido
    //     if (!req.user || typeof req.user.fk_rol !== "string") {
    //         return res.status(403).json({ error: "Acceso denegado: Datos del usuario inválidos." });
    //     }

       // Si requiredRoles es un string, lo convertimos en un array
       if (!Array.isArray(requiredRoles)) {
        requiredRoles = [requiredRoles]; 
      }

      const roleMapping = {
        1: "admin",
        2: "usuario"
      };
      // Verificar si el usuario tiene uno de los roles permitidos
      
      if (!requiredRoles.includes(roleMapping[req.user.fk_rol])) { 
        return res.status(403).json({ error: "Permiso denegado: Rol insuficiente." });
      }



      next(); 
      // Si todo es correcto, permite que la ejecución continúe hacia la siguiente función en la ruta.

    } catch (err) {
      // Captura errores durante la verificación del token JWT.

      if (err.name === "TokenExpiredError") { 
        // Si el token ha expirado, responde con un código 401 y sugiere iniciar sesión nuevamente.
        return res.status(401).json({ error: "Token expirado. Por favor, inicie sesión nuevamente." });
      }

      if (err.name === "JsonWebTokenError") { 
        // Si el token es inválido, responde con un código 401 y advierte sobre el acceso no autorizado.
        return res.status(401).json({ error: "Token inválido. Acceso no autorizado." });
      }

      // Si ocurre otro tipo de error inesperado, responde con un código 500 (Error interno en la autenticación).
      return res.status(500).json({ error: "Error interno en la autenticación." });
    }
  };
};

module.exports = verifyRole; // Exporta el middleware para que pueda ser utilizado en otras partes de la aplicación.


