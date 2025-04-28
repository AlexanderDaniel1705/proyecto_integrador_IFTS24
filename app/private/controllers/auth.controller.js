// Controlador para manejar la autenticación y registro de usuarios

const jwt = require("jsonwebtoken"); // Requiere el módulo 'jsonwebtoken', que se utiliza para crear y verificar tokens JSON Web.
const bcryptjs = require('bcryptjs'); // Requiere el módulo 'bcryptjs', que se utiliza para encriptar y comparar contraseñas.
const db = require('../models/db'); // Requiere la configuración de la base de datos desde el archivo '../db/db'.
const dotenv = require("dotenv");
// const path = require("path"); // Requiere el módulo 'path', que proporciona utilidades para trabajar con rutas de archivos y directorios.

dotenv.config();



//METODO POST//
const register = (req, res) => {
  console.log('Cuerpo recibido:', req.body);
console.log('Archivo recibido:', req.file);
  let imageName = req.file ? req.file.filename : "/images/default.png";
  if (req.file) { // Verifico si se ha subido un archivo
      imageName = req.file.filename; // Si se sube un archivo, asigno el nombre de la imagenimageName
  }

  // Extraigo los campos del cuerpo de la solicitud
  const {usuario, nombre, apellido, fk_rol, email, fecha_nacimiento, fk_genero, fk_provincia, contrasenia ,confirmPassword} = req.body;
  
const password = req.body['contrasenia'];

;

// Validación: Verifico que todos los campos requeridos estén presentes
  if (!usuario || !nombre || !apellido || !fk_rol || !email || !fecha_nacimiento || !fk_genero || !fk_provincia || !password) { 
    console.log("Validación de campos fallida. Valores recibidos:");
    console.log({usuario, nombre, apellido, imageName, fk_rol, email, fecha_nacimiento, fk_genero, fk_provincia, password});
      return res.status(400).json({error:'Todos los campos son requeridos.'}); // Si falta algún campo, envío un error 400
  }
  // Validar si el usuario ya existe (email o usuario duplicados)
const userExistQuery = `SELECT * FROM usuarios WHERE email = ? OR usuario = ?`;
  db.query(userExistQuery, [email, usuario], async (error, results) => {
    if (error) {
        return res.status(500).json({ error: 'Error al validar el usuario' });
        // Si ocurre un error en la consulta, devolvemos un código de error 500 (problema en el servidor).
    }
      
    if (results.length > 0) {
      return res.status(400).json({ error: 'Usuario y/o email en uso' })
    }
    
    
  // Validar que el nombre de usuario tenga 8 caracteres o más
  if (usuario.length < 8) {
    return res.status(400).json({
      error: "El nombre de usuario debe tener al menos 8 caracteres."
    });
  };


     //valido el formato del email 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
          return res.status(400).json({ mensaje: "El formato del correo es inválido"});
      }
  

  // Validar si las contraseñas coinciden
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Las contraseñas no coinciden." });
  }

    // Si no hay duplicados, proceder con el encriptado de la contraseña
    const saltRounds = 8; // Número de rondas para generar el salt (mayor es más seguro pero más lento).
    bcryptjs.hash(password, saltRounds, (err, hash) => {
    //bcryptjs.hash: bcryptjs es una biblioteca que se usa para encriptar contraseñas. 
    //El método hash se utiliza para convertir una contraseña en una cadena de texto encriptada (hash).
        if (err) {
         console.error('Error al encriptar la contraseña:', err); // Lo registro en la consola
            return res.status(500).json({ error: 'Error al encriptar la contraseña' });
            // Si ocurre un error al encriptar la contraseña, devolvemos un error 500.
        }
        // Guardar el nuevo usuario en la base de datos
        const createUserQuery = `
          INSERT INTO usuarios (usuario, nombre, apellido, imagen_perfil, fk_rol, email, fecha_nacimiento, fk_genero, fk_provincia, contrasenia)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [usuario, nombre, apellido, imageName, fk_rol, email, fecha_nacimiento, fk_genero, fk_provincia, hash]; // Valores a insertar en la base de datos
        db.query(createUserQuery, values, (error, results) => {
            if (error) {
              //console.error('Error registrando usuario:', error); // Lo registro en la consola
                return res.status(500).json({ error: 'Error al crear el usuario' });
                // Si hay un problema al insertar el usuario en la base de datos, devolvemos un error 500.
            }
            const userId = results.insertId; // Obtengo el ID del nuevo usuario insertado
            res.status(201).json({ id: userId, mensaje: 'Usuario registrado exitosamente', redirect: '/login' });
      
            // Si todo fue exitoso, devolvemos un código 201 indicando que el usuario fue creado correctamente.
        });
    });
  });
};

const login = (req, res) => {
  const { usuario, contrasenia } = req.body; 
  console.log(req.body);
  // const password = req.body['contraseña'] || req.body['contraseÃ±a']; // Maneja posibles problemas de codificación
  if (!usuario || !contrasenia) {
    // console.error('Datos faltantes:', { usuario, contrasenia });
      return res.status(400).json({ error: 'Los campos estan incompletos.' });   
  };

  // Consulta SQL para seleccionar el usuario con el usuario  proporcionado
  db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (error, results) => {
      if (error) {
          // console.error('Error al iniciar sesión:', error);
          return res.status(400).json({ error: 'Error durante la consulta.' });
      }
      if (results.length === 0) {
      // console.log('No se encontró ningún usuario con el usuario:', usuario); 
          return res.status(401).json({ error: 'Usuario y/o contraseña no válidas.' });
      }
      const user = results[0]; // Obtenemos el usuario del resultado de la consulta
           // Validar la contraseña usando bcrypt
          bcryptjs.compare(contrasenia, user.contrasenia, (err, isValidPassword) => {
        
          // console.log(user.contrasenia)
          // console.log(contrasenia)
          if (err) {
              return res.status(500).json({ error: "Error interno del servidor. Intenta más tarde" });
          }
          // console.error("Error al verificar la contraseña:", err);

          // console.log("Resultado de la comparación:", isValidPassword);
          if (!isValidPassword) {
              return res.status(401).json({ error: "Usuario y/o contraseña no válidas." });
          }
          // Generamos un token JWT para el usuario autenticado
          const token = jwt.sign({ id: user.id, usuario: user.usuario, fk_rol: user.fk_rol }, process.env.SECRET_KEY, {expiresIn:process.env.JWT_EXPIRATION});
          const cookieOption = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES *24 *60 *60 *1000),
            path:"/"
          }
          res.cookie("jwt",token,cookieOption);

          
          // Imprimir el token generado en la consola para depuración
          // console.log("Token generado para el usuario:", token);

            // Verificar el rol del usuario para definir la redirección
      // if (user.fk_rol === 1) { // Si es admin
      //   return res.json({ 
      //     message: 'Inicio de sesión exitoso', 
      //     auth: true, 
      //     token, 
      //     redirect: "/admin" 
      //   });
      // } else { // Para otros roles puedes definir otra ruta o mostrar un error
      //   return res.json({ 
      //     message: 'Inicio de sesión exitoso', 
      //     auth: true, 
      //     token, 
      //     redirect: "/" 
      //   });
      // }
    
          const redirectUrl = user.fk_rol === 1 ? "/admin" : "/dashboard";
          // URL de la imagen de perfil (esto debe ser relativo a donde se sirven las imágenes)
          const imageUrl = user.imagen_perfil ? `http://localhost:3000/uploads/${user.imagen_perfil}` : null;

          res.json({ message: 'Inicio de sesión exitoso',
            auth: true ,
            token,
            redirect:redirectUrl,
            user: { // Aca estamos incluyendo los datos del usuario
              usuario: user.usuario,
              email: user.email,
              imageUrl 
            }
          });
      });
      
  });
};



module.exports = { register, login };