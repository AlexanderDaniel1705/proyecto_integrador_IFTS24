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

// Para un tipo específico
const showGenero = (req, res) => {
    const { id } = req.params; // Obtenemos el ID de los parámetros de la URL
  
    const query = "SELECT * FROM generos WHERE id_genero = ?"; // Consulta SQL para obtener una cerveza por ID
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

// Crear un nuevo género
const storeGenero = (req, res) => {
    const { nombre_genero } = req.body; // Datos recibidos del cliente
    const query = 'INSERT INTO generos (nombre_genero) VALUES (?)';
    db.query(query, [nombre_genero], (err) => {
        if (err) return res.status(500).json({ error: 'Error al agregar el género' });
        res.status(201).json({ message: 'Género agregado exitosamente' }); // Mensaje en caso de éxito
    });
};

// Actualizar un género existente
const updateGenero = (req, res) => {
    const { id } = req.params; // ID del género recibido por parámetro
    const { nombre_genero } = req.body; // Nuevo nombre del género
    const query = 'UPDATE generos SET nombre_genero = ? WHERE id_genero = ?';
    db.query(query, [nombre_genero, id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar el género' });
        res.json({ message: 'Género actualizado exitosamente' }); // Mensaje en caso de éxito
    });
};

// Eliminar un género
const destroyGenero = (req, res) => {
    const { id } = req.params; // ID del género a eliminar
    const query = 'DELETE FROM generos WHERE id_genero = ?';
    db.query(query, [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar el género' });
        res.json({ message: 'Género eliminado exitosamente' }); // Mensaje en caso de éxito
    });
};

module.exports = { allGeneros, showGenero ,storeGenero, updateGenero, destroyGenero };
