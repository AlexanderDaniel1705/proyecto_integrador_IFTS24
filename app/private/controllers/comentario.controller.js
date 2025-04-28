// Controlador para manejar las operaciones CRUD de comentarios

const db = require('../models/db');

// Obtener todos los comentarios
const allComentarios = (req, res) => {
    const query = 'SELECT * FROM galeria';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener la galeria' });
        res.json(results);
    });
};

// Obtener un comentario por ID
const showComentario = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM galeria WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al buscar la imagen' });
        if (results.length === 0) return res.status(404).json({ error: 'Imagen no encontrado' });
        res.json(results[0]);
    });
};

// Crear 
const storeComentario = (req, res) => {
    let imageName = req.file ? req.file.filename : "/images/default.png";
  if (req.file) { // Verifico si se ha subido un archivo
      imageName = req.file.filename; // Si se sube un archivo, asigno el nombre de la imagenimageName
  }
    const { fk_usuario, pie_galeria } = req.body; // ID del usuario autenticado
    const userId = req.user ? req.user.id : null; //Evita error si `req.user` es undefined
      //  Validar que todos los datos necesarios estén presentes
      if (!fk_usuario || !pie_galeria ) {
        return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    const query = 'INSERT INTO galeria (fk_usuario, img_galeria, pie_galeria) VALUES (?, ?, ?)';
    db.query(query, [fk_usuario, imageName, pie_galeria], (err) => {
        if (err) return res.status(500).json({ error: 'Error al crear el comentario' });
        res.status(201).json({ message: 'Comentario creado exitosamente' });
    });
};


const updateComentario = (req, res) => { 
    const comentarioId = req.params.id;
    const {fk_usuario, pie_galeria } = req.body;
    const imageName = req.file ? req.file.filename : null; // Solo usa una nueva imagen si se sube una
    
    //Verifica que el ID y el comentario existen
    if (!fk_usuario || !pie_galeria) {
        return res.status(400).json({ error: "El ID_usuario  y el texto son requeridos." });
    }

    // Si no se sube una nueva imagen, obtener la actual de la base de datos
    const selectQuery = "SELECT img_galeria FROM galeria WHERE id_galeria = ?";
    db.query(selectQuery, [comentarioId], (err, result) => {
        if (err || result.length === 0) {
            console.error("Error al buscar la imagen existente:", err);
            return res.status(500).json({ error: "Error al buscar la imagen." });
        }

        const currentImage = result[0].img_galeria;
        const finalImage = imageName || currentImage; //  Si no hay nueva imagen, mantener la anterior

        // Actualizar el comentario con la imagen correcta
        const updateQuery = "UPDATE galeria SET fk_usuario = ?, img_galeria = ?, pie_galeria = ? WHERE id_galeria = ?";
        db.query(updateQuery, [fk_usuario, finalImage, pie_galeria, comentarioId], (updateErr) => {
            if (updateErr) {
                console.error("Error al actualizar la galería:", updateErr);
                return res.status(500).json({ error: "Error al actualizar la galería." });
            }
            res.json({ message: "Galería actualizada exitosamente." });
        });
    });
};

// Eliminar un comentario
const destroyComentario = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM galeria WHERE id_galeria = ?';
    db.query(sql, [id], (error, result) => {
      //console.log(result); // Imprime el resultado en la consola para depuración
        
      if (error) { // Si ocurre un error durante la consulta
        return res.status(500).json({ error: "ERROR: Intente más tarde por favor" }); // Envía un error 500 al cliente
    }
    
    if (result.affectedRows == 0) { // Si no se eliminó ningún registro
        return res.status(404).send({ error: "ERROR: la galeria a eliminar no existe" }); // Envía un error 404 al cliente
    }
    
    res.json({ mensaje: "Galeria eliminada" }); // Envía una respuesta exitosa con el mensaje "Comentario eliminado"
});
};

module.exports = { allComentarios, showComentario, storeComentario, updateComentario, destroyComentario };
