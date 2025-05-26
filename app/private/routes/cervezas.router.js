// Rutas relacionadas con cervezas
const express = require("express");
const router = express.Router();
const cervezasController = require("../controllers/cervezas.controller");

// Proteger las rutas con autenticación
// router.use(authenticateToken);

// Obtener todos los tipos de cerveza (usuarios autenticados)
router.get("/", cervezasController.allCervezas);

// Obtener una cerveza por ID
router.get("/:id", cervezasController.showCerveza);

// Crear un nuevo tipo de cerveza (solo admin)
router.post("/", cervezasController.storeCerveza);

// Actualizar un tipo de cerveza 
router.put('/:id',  cervezasController.updateCerveza);

// Eliminar un tipo de cerveza (solo admin)
router.delete("/:id", cervezasController.destroyCerveza);

module.exports = router;
