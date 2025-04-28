// Controlador para manejar las operaciones CRUD de géneros

const db = require('../models/db'); // Conexión a la base de datos

// Obtener todos los géneros
const allGeneros = (req, res) => {
    const query = 'SELECT * FROM generos';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener los géneros' });
        res.json(results); // Devuelve todos los géneros encontrados
    });
};

// Crear un nuevo género
const storeGenero = (req, res) => {
    const { nombre } = req.body; // Datos recibidos del cliente
    const query = 'INSERT INTO generos (nombre) VALUES (?)';
    db.query(query, [nombre], (err) => {
        if (err) return res.status(500).json({ error: 'Error al agregar el género' });
        res.status(201).json({ message: 'Género agregado exitosamente' }); // Mensaje en caso de éxito
    });
};

// Actualizar un género existente
const updateGenero = (req, res) => {
    const { id } = req.params; // ID del género recibido por parámetro
    const { nombre } = req.body; // Nuevo nombre del género
    const query = 'UPDATE generos SET nombre = ? WHERE id = ?';
    db.query(query, [nombre, id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el género' });
        res.json({ message: 'Género actualizado exitosamente' }); // Mensaje en caso de éxito
    });
};

// Eliminar un género
const destroyGenero = (req, res) => {
    const { id } = req.params; // ID del género a eliminar
    const query = 'DELETE FROM generos WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el género' });
        res.json({ message: 'Género eliminado exitosamente' }); // Mensaje en caso de éxito
    });
};

module.exports = { allGeneros, storeGenero, updateGenero, destroyGenero };
