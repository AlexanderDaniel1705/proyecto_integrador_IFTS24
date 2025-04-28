// Controlador para manejar las operaciones CRUD de cervezas

const db = require('../models/db');

// Obtener todos los tipos de cerveza
const allCervezas = (req, res) => {
    const query = 'SELECT * FROM cervezas';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener las cervezas' });
        res.json(results);
    });
};

// Crear un nuevo tipo de cerveza
const storeCerveza = (req, res) => {
    const { nombre, descripcion, precio, imagen } = req.body;
    const query = 'INSERT INTO cervezas (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)';
    db.query(query, [nombre, descripcion, precio, imagen], (err) => {
        if (err) return res.status(500).json({ error: 'Error al agregar la cerveza' });
        res.status(201).json({ message: 'Cerveza agregada exitosamente' });
    });
};

// Actualizar un tipo de cerveza
const updateCerveza = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen } = req.body;
    const query = 'UPDATE cervezas SET nombre = ?, descripcion = ?, precio = ?, imagen = ? WHERE id = ?';
    db.query(query, [nombre, descripcion, precio, imagen, id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar la cerveza' });
        res.json({ message: 'Cerveza actualizada exitosamente' });
    });
};

// Eliminar un tipo de cerveza
const destroyCerveza = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM cervezas WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar la cerveza' });
        res.json({ message: 'Cerveza eliminada exitosamente' });
    });
};

module.exports = { allCervezas, storeCerveza, updateCerveza, destroyCerveza };
