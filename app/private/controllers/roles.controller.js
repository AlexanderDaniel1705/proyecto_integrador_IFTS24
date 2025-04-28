// Controlador para manejar las operaciones CRUD 

const db = require('../models/db');

// Obtener todos los roles
const allRoles = (req, res) => {
    const query = 'SELECT * FROM roles';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener los roles' });
        res.json(results);
    });
};

// Para un rol específico
const showRol = (req, res) => {
    const { id } = req.params; // Obtenemos el ID de los parámetros de la URL
    const sql = "SELECT * FROM provincias WHERE id_rol = ?"; // Consulta SQL para obtener un rol por ID
    db.query(sql, [id], (error, rows) => { // Ejecuta la consulta en la base de datos
       // console.log(rows); // Imprime los resultados en la consola para depuración
        if (error) { // Si ocurre un error durante la consulta
            return res.status(500).json({ error: "ERROR: Intente más tarde" }); // Enviamos un error 500 al cliente
        }
        if (rows.length == 0) { // Si no se encuentra la provincia
            return res.status(404).send({ error: "ERROR: No existe el rol" }); // Enviamos un error 404 al cliente
        }
        res.json(rows[0]); // Enviamos la respuesta con la provincia encontrada
    });
};
// Crear un nuevo rol
const storeRol = (req, res) => {
    const { nombre } = req.body;
    const query = 'INSERT INTO roles (nombre) VALUES (?)';
    db.query(query, [nombre], (err) => {
        if (err) return res.status(500).json({ error: 'Error al agregar el rol' });
        res.status(201).json({ message: 'Rol agregada exitosamente' });
    });
};

// Actualizar un rol
const updateRol = (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const query = 'UPDATE provincias SET nombre_rol = ? WHERE id_rol = ?';
    db.query(query, [nombre, id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el rol' });
        res.json({ message: 'Rol actualizado exitosamente' });
    });
};

// Eliminar un rol
const destroyRol = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM roles WHERE id_rol = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el rol' });
        res.json({ message: 'Rol eliminada exitosamente' });
    });
};

module.exports = { allRoles, showRol, storeRol, updateRol, destroyRol };
