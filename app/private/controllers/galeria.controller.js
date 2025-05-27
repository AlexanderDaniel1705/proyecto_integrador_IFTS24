// Controlador para manejar las operaciones CRUD de comentarios

const db = require('../models/db');

// Obtener todos los comentarios en la galería
const allGaleria = (req, res) => {  
    // Definimos la consulta SQL para obtener datos de la galería y los usuarios relacionados
    const query = `
    SELECT
     galeria.id_galeria,         -- ID único del comentario en la galería
     usuarios.id_usuario AS fk_usuario, -- ID del usuario que hizo el comentario
     usuarios.usuario,           -- Nombre del usuario
     galeria.img_galeria,        -- Imagen asociada al comentario
     galeria.pie_galeria         -- Texto del comentario
     FROM galeria
     LEFT JOIN usuarios ON galeria.fk_usuario = usuarios.id_usuario -- Relacionamos la galería con los usuarios
    `;  

    // Ejecutamos la consulta en la base de datos
    db.query(query, (err, results) => {  
        if (err) {  
            console.error("Error al obtener la galería:", err); // Muestra el error en la consola
            return res.status(500).json({ error: 'Error al obtener la galería' }); // Devuelve error 500 si la consulta falla
        }  

        console.log("Datos enviados por la API:", JSON.stringify(results, null, 2)); // Muestra los resultados formateados
        res.json(results); // Envía la respuesta con todos los comentarios obtenidos
    });  
};  

// Obtener un comentario específico por su ID
const showGaleria = (req, res) => {  
    // Extraemos el ID del comentario desde los parámetros de la solicitud
    const { id } = req.params;  

    // Definimos la consulta SQL para obtener un comentario específico
    const query = `
    SELECT
     galeria.id_galeria,        
     usuarios.usuario AS usuario, 
     galeria.img_galeria,      
     galeria.pie_galeria       
     FROM galeria
     LEFT JOIN usuarios ON galeria.fk_usuario = usuarios.id_usuario
     WHERE galeria.id_galeria = ? 
     `;  

    // Ejecutamos la consulta en la base de datos
    db.query(query, [id], (err, results) => {  
        if (err) return res.status(500).json({ error: 'Error al buscar la galería' }); // Devuelve error si falla la consulta
        if (results.length === 0) return res.status(404).json({ error: 'Galería no encontrada' }); // Devuelve error si no hay resultados
        
        res.json(results[0]); // Envía la respuesta con el comentario encontrado
    });  
};

// Crear 
const storeGaleria = (req, res) => {
    let imageName = req.file ? req.file.filename : "/images/default.png";
  if (req.file) { // Verifico si se ha subido un archivo
      imageName = req.file.filename; // Si se sube un archivo, asigno el nombre de la imagenimageName
  }
    const { fk_usuario, pie_galeria } = req.body; // ID del usuario autenticado
    // const userId = req.user ? req.user.id : null; //Evita error si `req.user` es undefined
      //  Validar que todos los datos necesarios estén presentes
      if (!fk_usuario || !pie_galeria ) {
        return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    const query = 'INSERT INTO galeria (fk_usuario, img_galeria, pie_galeria) VALUES (?, ?, ?)';
    db.query(query, [fk_usuario, imageName, pie_galeria], (err) => {
        if (err) return res.status(500).json({ error: 'Error al crear la galeria' });
        res.status(201).json({ message: 'Galeria creada exitosamente' });
    });
};


// Función para actualizar un comentario en la galería
const updateGaleria = (req, res) => {  
    // Obtiene el ID del comentario desde los parámetros de la solicitud
    const galeriaId = req.params.id;

    // Extrae los datos del cuerpo de la solicitud
    const { fk_usuario, pie_galeria } = req.body;
    console.log("➡️ Datos recibidos para actualización:");
    console.log("ID galeria:", galeriaId);
    console.log("fk_usuario:", fk_usuario);
    console.log("pie_galeria:", pie_galeria);
    console.log("Archivo recibido:", req.file);
    // let imageName = req.file ? req.file.filename : "/images/default.png";

    // Verifica que los campos obligatorios estén presentes
    if (!fk_usuario || !pie_galeria) {  
        console.log("Datos recibidos en el PUT:", req.body); // Muestra los datos recibidos en la consola
        return res.status(400).json({ error: "El ID_usuario y el texto son requeridos." }); // Devuelve error si faltan datos
    }

    // Consulta SQL para obtener la imagen actual de la galería en caso de que no se suba una nueva
    const selectQuery = "SELECT img_galeria FROM galeria WHERE id_galeria = ?"; 

    // Ejecuta la consulta para recuperar la imagen actual
    db.query(selectQuery, [galeriaId], (err, result) => {  
        // Si ocurre un error o no se encuentra el registro, se responde con un error
        if (err || result.length === 0) {  
            console.error("Error al buscar la imagen existente:", err); // Muestra el error en la consola
            return res.status(500).json({ error: "Error al buscar la imagen." }); // Devuelve respuesta con error
        }

        // Extrae la imagen actual de la base de datos
        const currentImage = result[0].img_galeria;  

        // Si no se subió una nueva imagen, se mantiene la existente
        // const finalImage = imageName || currentImage;  
        const finalImage = req.file ? req.file.filename : currentImage;


        console.log("Imagen actual en la base de datos:", currentImage); // Muestra la imagen actual
        console.log("Imagen seleccionada para la actualización:", finalImage); // Muestra la imagen final seleccionada

        // Consulta SQL para actualizar los datos del comentario en la galería
        const updateQuery = "UPDATE galeria SET fk_usuario = ?, img_galeria = ?, pie_galeria = ? WHERE id_galeria = ?"; 

        // Ejecuta la consulta SQL con los nuevos datos
        db.query(updateQuery, [fk_usuario, finalImage, pie_galeria, galeriaId], (updateErr) => {  
            // Si ocurre un error, responde con código 500
            if (updateErr) {  
                console.error("Error al actualizar la galería:", updateErr); // Muestra el error en la consola
                return res.status(500).json({ error: "Error al actualizar la galería." }); // Devuelve mensaje de error
            }

            // Responde con éxito si la actualización se realizó correctamente
            res.json({ message: "Galería actualizada exitosamente." });  
        });
    });
};

// Eliminar un comentario
const destroyGaleria = (req, res) => {
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

module.exports = { allGaleria, showGaleria, storeGaleria, updateGaleria, destroyGaleria };
