// Rutas relacionadas con provincias
const express = require("express");
const router = express.Router();
const rolesController = require("../controllers/roles.controller");
// const authenticateToken = require("../middleware/authRole.middleware");
// const { checkRole } = require('../middleware/roles.middleware');

// Proteger las rutas con autenticación
// router.use(authenticateToken);

// Obtener todas las provincias (usuarios autenticados)
router.get("/", rolesController.allRoles);

router.get("/:id", rolesController.showRol);

// Crear una nueva provincia (solo admin)
router.post("/", rolesController.storeRol);

// Actualizar una provincia (solo admin)
router.put("/:id", rolesController.updateRol);

// Eliminar una provincia (solo admin)
router.delete("/:id", rolesController.destroyRol);

module.exports = router;