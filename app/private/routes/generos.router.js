// Rutas relacionadas con los géneros
const express = require("express");
const router = express.Router();
const generosController = require("../controllers/generos.controller"); // Importar el controlador de géneros
// const authenticateToken = require("../middleware/authRole.middleware"); // Middleware para autenticar tokens JWT
// const { checkRole } = require('../middleware/roles.middleware'); // Middleware para verificar roles

// Proteger todas las rutas con autenticación
// router.use(authenticateToken);

// Obtener todos los géneros (disponible para todos los usuarios autenticados)
router.get("/", generosController.allGeneros);

// Crear un nuevo género (solo para administradores)
router.post("/", generosController.storeGenero);

// Actualizar un género existente (solo para administradores)
router.put("/:id", generosController.updateGenero);

// Eliminar un género (solo para administradores)
router.delete("/:id", generosController.destroyGenero);

module.exports = router;
