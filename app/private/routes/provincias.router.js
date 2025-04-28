// Rutas relacionadas con provincias
const express = require("express");
const router = express.Router();
const provinciasController = require("../controllers/provincias.controller");
// const authenticateToken = require("../middleware/authRole.middleware");
// const { checkRole } = require('../middleware/roles.middleware');

// Proteger las rutas con autenticación
// router.use(authenticateToken);

// Obtener todas las provincias (usuarios autenticados)
router.get("/", provinciasController.allProvincias);

router.get("/:id", provinciasController.showProvincia);

// Crear una nueva provincia (solo admin)
router.post("/", provinciasController.storeProvincia);

// Actualizar una provincia (solo admin)
router.put("/:id", provinciasController.updateProvincia);

// Eliminar una provincia (solo admin)
router.delete("/:id", provinciasController.destroyProvincia);

module.exports = router;
