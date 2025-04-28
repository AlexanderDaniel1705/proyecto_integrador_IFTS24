// Controlador para manejar las operaciones CRUD de provincias

const db = require('../models/db');

// Obtener todas las provincias
const allProvincias = (req, res) => {
    const query = 'SELECT * FROM provincias';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener las provincias' });
        res.json(results);
    });
};

// Para una provincia específica
const showProvincia = (req, res) => {
    const { id } = req.params; // Obtenemos el ID de los parámetros de la URL
    const sql = "SELECT * FROM provincias WHERE id_provincia = ?"; // Consulta SQL para obtener una provincia por ID
    db.query(sql, [id], (error, rows) => { // Ejecuta la consulta en la base de datos
       // console.log(rows); // Imprime los resultados en la consola para depuración
        if (error) { // Si ocurre un error durante la consulta
            return res.status(500).json({ error: "ERROR: Intente más tarde" }); // Enviamos un error 500 al cliente
        }
        if (rows.length == 0) { // Si no se encuentra la provincia
            return res.status(404).send({ error: "ERROR: No existe la provincia" }); // Enviamos un error 404 al cliente
        }
        res.json(rows[0]); // Enviamos la respuesta con la provincia encontrada
    });
};
// Crear una nueva provincia
const storeProvincia = (req, res) => {
    const { nombre } = req.body;
    const query = 'INSERT INTO provincias (nombre) VALUES (?)';
    db.query(query, [nombre], (err) => {
        if (err) return res.status(500).json({ error: 'Error al agregar la provincia' });
        res.status(201).json({ message: 'Provincia agregada exitosamente' });
    });
};

// Actualizar una provincia
const updateProvincia = (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const query = 'UPDATE provincias SET nombre_provincia = ? WHERE id_provincia = ?';
    db.query(query, [nombre, id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar la provincia' });
        res.json({ message: 'Provincia actualizada exitosamente' });
    });
};

// Eliminar una provincia
const destroyProvincia = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM provincias WHERE id_provincia = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar la provincia' });
        res.json({ message: 'Provincia eliminada exitosamente' });
    });
};

module.exports = { allProvincias, showProvincia, storeProvincia, updateProvincia, destroyProvincia };
