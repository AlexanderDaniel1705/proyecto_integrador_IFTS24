// Rutas relacionadas con los clientes
const express = require("express");
const router = express.Router();
const clientesController = require("../controllers/clientes.controller");
// const authenticateToken = require("../middleware/authRole.middleware");
// const { checkRole } = require('../middleware/roles.middleware');

// Proteger las rutas con autenticación
// router.use(authenticateToken);

// Obtener todos los clientes (solo admin)
router.get("/", clientesController.allClientes);

// Obtener un cliente por ID
router.get("/:id", clientesController.showCliente);

// Crear un nuevo cliente (solo admin)
router.post("/", clientesController.storeCliente);

// Actualizar un cliente (solo admin)
router.put("/:id", clientesController.updateCliente);

// Eliminar un cliente (solo admin)
// router.delete('/:id', checkRole('admin'), clientesController.destroyCliente);

module.exports = router;
