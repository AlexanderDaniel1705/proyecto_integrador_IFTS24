// Rutas para gestionar comentarios
const express = require("express");
const router = express.Router();
const comentarioController = require("../controllers/comentario.controller");

// const authenticateToken = require("../middleware/authRole.middleware"); // Middleware para autenticar tokens JWT
// const { checkRole } = require("../middleware/roles.middleware"); // Middleware para verificar roles

// MULTER
const multer = require("multer"); // Requiere el módulo 'multer', que es un middleware para manejar la subida de archivos en Node.js.
const path = require("path"); // Requiere el módulo 'path', que proporciona utilidades para trabajar con rutas de archivos y directorios.

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    // Define el destino donde se guardarán los archivos subidos
    destination: (req, file, cb) => {
        cb(null,  path.join(__dirname, '../../public/uploadsGaleria')); // Define la carpeta 'uploads' como destino, esta carpeta debe existir en la raíz del proyecto
    },
    // Define el nombre único del archivo subido
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname); // Obtener la extensión del archivo original
        cb(null, file.fieldname + '-' + uniqueSuffix + extension); // Ejemplo: imagen_perfil-123456789.png
    },
});

// Inicializa Multer con la configuración de almacenamiento
const uploadGaleria = multer({
    storage, // Utiliza la configuración de almacenamiento definida anteriormente
    fileFilter: (req, file, cb) => {
        //console.log(file); // Imprime información del archivo en la consola para depuración
        const fileTypes = /jpg|jpeg|png/; // Define los tipos de archivo permitidos (jpg, jpeg, png)
        const mimetype = fileTypes.test(file.mimetype); // Verifica que el tipo MIME del archivo sea válido
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); // Verifica que la extensión del archivo sea válida
        if (mimetype && extname) { // Si el tipo MIME y la extensión son válidos
            return cb(null, true); // Acepta el archivo
        }
        return cb(new Error('Tipo de archivo no soportado')); // Retorna un error explícito
          // Si el archivo no es válido, devuelve un error
    },
    limits: { fileSize: 1024 * 1024 * 1 }, // Define el límite de tamaño del archivo (aproximadamente 1Mb)
});
// const authenticateToken = require("../middleware/authRole.middleware");

// Proteger las rutas con autenticación
// router.use(authenticateToken);

// Obtener todos los comentarios (admin)
router.get("/", comentarioController.allComentarios);

// Obtener un comentario por ID
router.get("/:id", comentarioController.showComentario);

// Crear un nuevo comentario (usuario autenticado)
router.post("/",uploadGaleria.single("img_galeria"), comentarioController.storeComentario);

// Actualizar un comentario (solo el dueño)
router.put("/:id",uploadGaleria.single("img_galeria"), comentarioController.updateComentario);



// Eliminar un comentario (solo el dueño)
router.delete("/:id", comentarioController.destroyComentario);

module.exports = router;
