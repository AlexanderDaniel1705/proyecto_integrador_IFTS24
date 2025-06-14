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

     // Mapeo de roles: Convierte valores numéricos en nombres de roles legibles.
    // Esto facilita la comparación de roles en la autenticación.
        const roleMapping = {
            1: "admin",  // El rol "1" representa un administrador.
            2: "usuario" // El rol "2" representa un usuario estándar.
        };
  
      // Verificar si el usuario tiene uno de los roles permitidos
      
      if (!requiredRoles.includes(roleMapping[req.user.fk_rol])) { 
        return res.status(403).json({ error: "Permiso denegado: Rol insuficiente." });
      }


        //Evitar cacheo de páginas privadas
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');

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


