// Controlador para manejar las operaciones CRUD de clientes

const db = require('../models/db');

// Obtener todos los clientes
const allClientes = (req, res) => {
    const query = 'SELECT * FROM clientes';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener los clientes' });
        res.json(results);
    });
};

// Obtener un cliente por ID
const showCliente = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM clientes WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al buscar el cliente' });
        if (results.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
        res.json(results[0]);
    });
};

// Crear un nuevo cliente
const storeCliente = (req, res) => {
    const { nombre, email, telefono } = req.body;
    const query = 'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)';
    db.query(query, [nombre, email, telefono], (err) => {
        if (err) return res.status(500).json({ error: 'Error al crear el cliente' });
        res.status(201).json({ message: 'Cliente creado exitosamente' });
    });
};

// Actualizar un cliente
const updateCliente = (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono } = req.body;
    const query = 'UPDATE clientes SET nombre = ?, email = ?, telefono = ? WHERE id = ?';
    db.query(query, [nombre, email, telefono, id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el cliente' });
        res.json({ message: 'Cliente actualizado exitosamente' });
    });
};

// Eliminar un cliente
const destroyCliente = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM clientes WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el cliente' });
        res.json({ message: 'Cliente eliminado exitosamente' });
    });
};

module.exports = { allClientes, showCliente, storeCliente, updateCliente, destroyCliente };
