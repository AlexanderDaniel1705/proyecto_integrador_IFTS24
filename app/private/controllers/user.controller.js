// Controlador para manejar las operaciones CRUD de usuarios

const db = require('../models/db'); // Conexión a la base de datos
const bcryptjs = require('bcryptjs'); // Para encriptar contraseñas
const jwt = require("jsonwebtoken"); // Requiere el módulo 'jsonwebtoken', que se utiliza para crear y verificar tokens JSON Web.
const dotenv = require("dotenv");
dotenv.config();


// Obtener todos los usuarios (solo para administradores)
const allUsers = (req, res) => {
    const query = `
        SELECT 
            usuarios.id_usuario, 
            usuarios.usuario, 
            usuarios.nombre, 
            usuarios.apellido, 
            usuarios.imagen_perfil, 
            roles.nombre_rol AS nombre_rol,
            usuarios.email, 
            usuarios.fecha_nacimiento, 
            generos.nombre_genero AS nombre_genero, 
            provincias.nombre_provincia AS nombre_provincia, 
            usuarios.contrasenia
        FROM usuarios
        LEFT JOIN roles ON usuarios.fk_rol = roles.id_rol
        LEFT JOIN generos ON usuarios.fk_genero = generos.id_genero
        LEFT JOIN provincias ON usuarios.fk_provincia = provincias.id_provincia
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error al obtener los usuarios:", err);
            return res.status(500).json({ error: "Error al obtener los usuarios" });
        }
        res.json(results); // Envía los resultados como JSON al frontend
    });
};


// Obtener un usuario por ID
const showUser = (req, res) => {
    const { id } = req.params;
    
    const query = `
    SELECT 
    usuarios.id_usuario, 
    usuarios.usuario, 
    usuarios.nombre, 
    usuarios.apellido, 
    usuarios.imagen_perfil, 
    roles.nombre_rol AS nombre_rol,
    usuarios.email, 
    usuarios.fecha_nacimiento, 
    generos.nombre_genero AS nombre_genero, 
    provincias.nombre_provincia AS nombre_provincia, 
    usuarios.contrasenia
FROM usuarios
LEFT JOIN roles ON usuarios.fk_rol = roles.id_rol
LEFT JOIN generos ON usuarios.fk_genero = generos.id_genero
LEFT JOIN provincias ON usuarios.fk_provincia = provincias.id_provincia
WHERE usuarios.id_usuario = ?`;
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al buscar el usuario' });
        if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(results[0]); // Devuelve el usuario encontrado
    });
};


// Crear un nuevo usuario (solo para administradores)
const enviarEmail = require("../services/emailService");

const storeUser = async (req, res) => {
    let imageName = req.file ? req.file.filename : "/images/default.png";

    if (req.file) {
        imageName = req.file.filename;
    }

    const { usuario, nombre, apellido, fk_rol, email, fecha_nacimiento, fk_genero, fk_provincia } = req.body;

    if (!usuario || !nombre || !apellido || !imageName || !fk_rol || !email || !fecha_nacimiento || !fk_genero || !fk_provincia) {
        return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    const userExistQuery = `SELECT * FROM usuarios WHERE email = ? OR usuario = ?`;
    db.query(userExistQuery, [email, usuario], (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Error al validar el usuario" });
        }

        if (results.length > 0) {
            let mensajeError = "";
            if (results.some(result => result.email === email)) mensajeError += "Email ya existente. ";
            if (results.some(result => result.usuario === usuario)) mensajeError += "Nombre de usuario ya existente. ";
            return res.status(400).json({ error: mensajeError.trim() });
        }

        const generarContraseñaTemporal = () => {
            return Math.random().toString(36).slice(-8); // Genera una contraseña de 8 caracteres alfanuméricos
        };
        const contraseñaTemporal = generarContraseñaTemporal();

        const createUserQuery = `
            INSERT INTO usuarios (usuario, nombre, apellido, imagen_perfil, fk_rol, email, fecha_nacimiento, fk_genero, fk_provincia, contrasenia, debe_cambiar_contrasenia)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [usuario, nombre, apellido, imageName, fk_rol, email, fecha_nacimiento, fk_genero, fk_provincia, contraseñaTemporal, true];

        db.query(createUserQuery, values, async (error, results) => {
            console.error("Error al ejecutar la consulta:", error); 
            if (error) {
                return res.status(500).json({ error: "Error al crear el usuario" });
            }

            try {
                await enviarEmail(usuario, email, contraseñaTemporal); // Enviar el correo electrónico
                res.status(201).json({ mensaje: "Usuario creado exitosamente y correo enviado." });
            } catch (emailError) {
                console.error(`Error al enviar correo →`, emailError.message);
                return res.status(500).json({ 
                    error: `Usuario creado pero no se pudo enviar el correo. Detalles: ${emailError.message}` 
                });
            
            }
        });
    });
};

// Función para actualizar un usuario existente en la base de datos
const updateUser = (req, res) => {
    // Extraemos el ID del usuario desde los parámetros de la solicitud
    const { id } = req.params; 

    // Si se sube un archivo, se usa su nombre; de lo contrario, se deja como "null"
    const imageName = req.file ? req.file.filename : null; 

    // Extraemos los datos enviados en el cuerpo de la solicitud
    const { usuario, nombre, apellido, fk_rol, email, fecha_nacimiento, fk_genero, fk_provincia } = req.body; 

    // Verificamos que todos los campos requeridos estén presentes
    if (!usuario || !nombre || !apellido || !fk_rol || !email || !fecha_nacimiento || !fk_genero || !fk_provincia) {
        console.log(req.body); // Muestra en la consola los datos recibidos para depuración
        return res.status(400).json({ mensaje: "Todos los campos son requeridos" }); // Envía un error si falta algún campo
    }

    // Consulta SQL para obtener la imagen de perfil actual del usuario
    const selectQuery = "SELECT imagen_perfil FROM usuarios WHERE id_usuario = ?"; 
    
    // Ejecutamos la consulta para recuperar la imagen existente
    db.query(selectQuery, [id], (err, result) => {
        // Si hay un error o el usuario no existe, devolvemos un mensaje de error
        if (err || result.length === 0) {
            console.error("Error al buscar la imagen existente:", err);
            return res.status(500).json({ error: "Error al buscar la imagen." });
        }

        // Extraemos la imagen actual del usuario y definimos cuál se usará finalmente
        const currentImage = result[0].imagen_perfil; 
        const finalImage = imageName || currentImage; // Si no hay nueva imagen, mantenemos la anterior

        // Consulta SQL para actualizar la información del usuario en la base de datos
        const query = 'UPDATE usuarios SET usuario = ?, nombre = ?, apellido = ?, imagen_perfil = ?, fk_rol = ?, email = ?, fecha_nacimiento = ?, fk_genero = ?, fk_provincia = ? WHERE id_usuario = ?';

        // Definimos los valores a actualizar en la base de datos
        const values = [usuario, nombre, apellido, finalImage, fk_rol, email, fecha_nacimiento, fk_genero, fk_provincia, id];

        // Ejecutamos la consulta para actualizar los datos
        db.query(query, values, (error) => {
            // Si hay un error al actualizar, enviamos una respuesta con código 500
            if (error) {
                return res.status(500).json({ error: 'Error al actualizar el usuario' });
            }

            // Si la actualización es exitosa, enviamos una respuesta con mensaje de éxito
            res.json({ message: 'Usuario actualizado exitosamente' });
        });
    });
};

const patchUser =  (req,res) => {
    const {id} = req.params;//obtengo id del usuario desde los parametros de la url
    const datosActualizados = req.body; //obtener los campos q se deben actualizar desde el campo de la solicitud
    let imageName= "";
    
    //verificar si se subió un archivo(imagen)
    if  (req.file) {
        imageName = req.file.filename; //obtengo el nombre del archivo mediante multer
        datosActualizados.imagen_perfil = imageName; //agrego imagen al objeto de campos actualizados
    }

    //filtro los campos validos
    const camposValidos = [
        "usuario", "nombre", "apellido", "imagen_perfil", "fk_rol", "email",
        "fecha_nacimiento","fk_genero","fk_provincia"
    ];
    const datosFiltrados = {};
    Object.keys(datosActualizados).forEach((campo) => {
        if (camposValidos.includes(campo)) {
            datosFiltrados[campo] = datosActualizados[campo];
        }
    });
    if (Object.keys(datosFiltrados).length ===0) {
        return res.status(400).json({ mensaje: "No se enviaron campos válidos para actualizar"});
    }

    //valido el formato del email 
    if (datosFiltrados.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(datosFiltrados.email)) {
            return res.status(400).json({ mensaje: "El formato del correo es inválido"});
        }
    }

//validar campos numericos
const camposNumericos= ["fk_rol","fk_genero","fk_provincia"]
    if (camposNumericos.some((campo) => datosFiltrados[campo] && isNaN(datosFiltrados[campo]))) {
        return res.status(400).json({ mensaje: `Los campos deben tener valores válidos`})
    }


//construyo la consulta sql dinamicamente según los campos enviados
const setQuery = Object.keys(datosFiltrados)
.map((campo) => `${campo} = ?`)
.join(", ");
const values = Object.values(datosFiltrados);

//Agrego el ID al final para el where
const query = `UPDATE usuarios SET ${setQuery} WHERE id_usuario = ?`;
values.push(id);

//ejecuto la connsulta sql
db.query(query, values, (error, results) => {
    if (error) {console.log("Error al actualizar el usuario", error); 
    return res.status(500).json({ error: "Error al actualizar el usuario"});
}
//responder con exito y devolver los adatos actualizados
res.json({
    mensaje: "Usuario actualizado correctamente",
    datos: datosFiltrados,
});
});
}

// Eliminar un usuario
const destroyUser =  (req, res) => {
    const userId = req.params.id;
    const query = 'DELETE FROM usuarios WHERE id_usuario = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Error:", err); // Registrar el error para depuración
            return res.status(500).json({ error: 'Error al eliminar el usuario' });
        }

        // Si no se afecta ninguna fila, significa que el usuario no existe
        if (results.affectedRows === 0) {
            console.log(results);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Enviamos respuesta exitosa si la eliminación fue correcta
        return res.json({ message: 'Usuario eliminado exitosamente' });
    });
};

module.exports = { allUsers, showUser, storeUser, updateUser, patchUser, destroyUser };
