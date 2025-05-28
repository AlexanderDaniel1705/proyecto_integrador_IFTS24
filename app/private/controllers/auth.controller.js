// Controlador para manejar la autenticación y registro de usuarios

const jwt = require("jsonwebtoken"); // Importo el módulo 'jsonwebtoken', que se utiliza para crear y verificar tokens JSON Web.
const bcryptjs = require('bcryptjs'); // Importo el módulo 'bcryptjs', que se utiliza para encriptar y comparar contraseñas.
const db = require('../models/db'); // Importo la configuración de la base de datos desde el archivo '../db/db'.
const dotenv = require("dotenv");
dotenv.config();
const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3000';




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
  // Extraemos los datos enviados en el cuerpo de la solicitud
  const { usuario, contrasenia } = req.body;   
  console.log(req.body); // Mostramos los datos recibidos en la consola para depuración
  
  // Si falta el usuario o la contraseña, respondemos con un error 400
  if (!usuario || !contrasenia) {   
      return res.status(400).json({ error: 'Los campos están incompletos.' });    
  }

  // Consulta SQL para verificar si el usuario existe en la base de datos
  db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (error, results) => {   
      if (error) {   
          return res.status(400).json({ error: 'Error durante la consulta.' });   
      }

      // Si no se encuentra el usuario, enviamos un error 401 (credenciales incorrectas)
      if (results.length === 0) {    
          return res.status(401).json({ error: 'Usuario y/o contraseña no válidas.' });    
      }
      
      // Guardamos el usuario obtenido de la consulta
      const user = results[0];   

      // Validamos la contraseña ingresada comparándola con la almacenada en la base de datos
      bcryptjs.compare(contrasenia, user.contrasenia, (err, isValidPassword) => {   
          if (err) {   
              return res.status(500).json({ error: "Error interno del servidor. Intenta más tarde" });    
          }

            // Si el usuario tiene una contraseña temporal, permitir el acceso directamente
        if (!isValidPassword && user.debe_cambiar_contrasenia) {    
          isValidPassword = contrasenia === user.contrasenia; // Comparación directa de la provisoria
      }

          // Si la contraseña no es válida, respondemos con error 401
          if (!isValidPassword) {   
              return res.status(401).json({ error: "Usuario y/o contraseña no válidas." });   
          }

          // Generamos un token JWT con la información del usuario
          const token = jwt.sign({ 
              id: user.id, 
              usuario: user.usuario, 
              fk_rol: user.fk_rol 
          }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_EXPIRATION });

          console.log("Token generado:", token); // Mostramos el token en la consola

          // Configuración de la cookie JWT para almacenar el token en el cliente
          const cookieOption = {    
            expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRES) * 24 * 60 * 60 * 1000), // Define la expiración
            path: "/"  ,// Aplica la cookie en toda la aplicación
            httpOnly: true,
            secure: true,
            sameSite: "None"
          };

          res.cookie("jwt", token, cookieOption); // Envía la cookie al navegador

          console.log(req.cookies); // Muestra las cookies en la consola para verificar el almacenamiento

          // Definimos la URL de redirección según el rol del usuario
          // const redirectUrl = user.fk_rol === 1 ? "/admin" : "/dashboard";  
          const redirectUrl = user.debe_cambiar_contrasenia ? "/cambiar-contrasenia" : (user.fk_rol === 1 ? "/admin" : "/dashboard");  



          // Definimos la URL de la imagen de perfil del usuario (si existe)
          //const imageUrl = user.imagen_perfil ? `http://localhost:3000/uploads/${user.imagen_perfil}` : null;
          const imageUrl = user.imagen_perfil ? `${PUBLIC_URL}/uploads/${user.imagen_perfil}` : `${PUBLIC_URL}/uploads/default.png`;

          // Enviamos la respuesta JSON con la información del usuario y el token
          res.json({ 
            message: 'Inicio de sesión exitoso',    
            auth: true,   
            redirect: redirectUrl,    
            user: { //Estructuro Datos del usuario para el frontend    
              usuario: user.usuario,    
              email: user.email,    
              imageUrl    
            }    
          });    
      });    
  });    
};


module.exports = { register, login };