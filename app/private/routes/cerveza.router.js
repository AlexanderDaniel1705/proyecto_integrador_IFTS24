// Rutas relacionadas con cervezas
const express = require("express");
const router = express.Router();
const cervezaController = require("../controllers/cerveza.controller");
// const authenticateToken = require("../middleware/authRole.middleware");
// const { checkRole } = require('../middleware/roles.middleware');

// Proteger las rutas con autenticación
// router.use(authenticateToken);

// Obtener todos los tipos de cerveza (usuarios autenticados)
router.get("/", cervezaController.allCervezas);

// Crear un nuevo tipo de cerveza (solo admin)
router.post("/", cervezaController.storeCerveza);

// Actualizar un tipo de cerveza (solo admin)
// router.put('/:id', checkRole('admin'), cervezaController.updateCerveza);

// Eliminar un tipo de cerveza (solo admin)
router.delete("/:id", cervezaController.destroyCerveza);

module.exports = router;
