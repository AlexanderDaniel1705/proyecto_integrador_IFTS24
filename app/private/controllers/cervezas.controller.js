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
// Para un tipo específico
const showCerveza = (req, res) => {
    const { id } = req.params; // Obtenemos el ID de los parámetros de la URL
  
    const query = "SELECT * FROM cervezas WHERE id = ?"; // Consulta SQL para obtener una cerveza por ID
    db.query(query, [id], (error, rows) => { // Ejecuta la consulta en la base de datos
       // console.log(rows); // Imprime los resultados en la consola para depuración
        if (error) { // Si ocurre un error durante la consulta
            return res.status(500).json({ error: "ERROR: Intente más tarde" }); // Enviamos un error 500 al cliente
        }
        if (rows.length == 0) { // Si no se encuentra la provincia
            return res.status(404).send({ error: "ERROR: No existe esa cerveza" }); // Enviamos un error 404 al cliente
        }
        res.json(rows[0]); // Enviamos la respuesta con la cerveza encontrada
    });
};

// Crear un nuevo tipo de cerveza
const storeCerveza = (req, res) => {
    const { nombre_cerveza, descripcion_cerveza } = req.body;
    const query = 'INSERT INTO cervezas (nombre_cerveza, descripcion_cerveza) VALUES (?, ?)';
    db.query(query, [nombre_cerveza, descripcion_cerveza], (err) => {
        if (err) return res.status(500).json({ error: 'Error al agregar la cerveza' });
        res.status(201).json({ message: 'Cerveza agregada exitosamente' });
    });
};

// Actualizar un tipo de cerveza
const updateCerveza = (req, res) => {
    const { id } = req.params;
    const { nombre_cerveza, descripcion_cerveza } = req.body;
    const query = 'UPDATE cervezas SET nombre_cerveza = ?, descripcion_cerveza = ? WHERE id = ?';
    db.query(query, [nombre_cerveza, descripcion_cerveza, id], (err) => {
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

module.exports = { allCervezas,showCerveza, storeCerveza, updateCerveza, destroyCerveza };
