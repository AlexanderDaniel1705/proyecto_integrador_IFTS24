// Archivo principal del servidor
const dotenv = require('dotenv');
const express = require("express"); // Framework Express
const cors = require('cors');
const path = require("path"); // Para manejar rutas
const app = express(); // Inicializa la app Express
const morgan = require("morgan");
const cookieParser = require("cookie-parser"); 
app.use(cookieParser());
const verifyRole = require('./private/middleware/authRole.middleware');
const verificarToken = require('./private/middleware/verificarToken');

//MIddlewares
app.use(morgan("dev"));

// dotenv.config({ path: '../private/.env' }); // Cargar variables de entorno

//  const result =
dotenv.config({ path: path.join(__dirname, '../app/private/.env') });
//const PUBLIC_URL = process.env.PUBLIC_URL || 'http://localhost:3000';

// console.log('Ruta .env configurada en:', path.join(__dirname, '..../app/private/.env'));
// console.log(`Conexión a la base de datos en: ${process.env.DB_HOST}`);

// if (result.error) {
//   console.error('Error cargando el archivo .env:', result.error);
// } else {
//   console.log('Archivo .env cargado exitosamente');
// }

// Hacer pública la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));
//// Middleware que transforma el cuerpo de la petición (JSON) en un objeto JavaScript.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Ruta genérica para servir cualquier archivo HTML dentro de 'views'
// app.get('/:page', (req, res) => {
//     const page = req.params.page; // Obtiene el parámetro de la URL
//     const filePath = path.join(__dirname, 'views', `${page}.html`);
//     res.sendFile(filePath, (err) => {
//         if (err) {
//             res.status(404).send('Página no encontrada'); // Maneja errores si no existe el archivo
//         }
//     });
// });

// Servir archivos estáticos desde la carpeta 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploadsGaleria", express.static(path.join(__dirname, "uploadsGaleria")));

// Debe estar antes de app.use(cors(...))
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://6886-2800-40-80-1b5c-c591-4908-2da9-5706.ngrok-free.app');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  return res.sendStatus(204);
});

// Después viene el cors (sin optionsSuccessStatus, porque ya lo manejaste arriba)
app.use(cors({
  origin: 'https://6886-2800-40-80-1b5c-c591-4908-2da9-5706.ngrok-free.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Middleware adicional para todos los demás requests (no OPTIONS)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
  next();
});

// Importar rutas
const authRouter = require("./private/routes/auth.router");
const clientesRouter = require("./private/routes/clientes.router");
const galeriaRouter = require("./private/routes/galeria.router");
const cervezasRouter = require("./private/routes/cervezas.router");
const provinciasRouter = require("./private/routes/provincias.router");
const generosRouter = require("./private/routes/generos.router");
const userRouter = require("./private/routes/user.router");
const rolesRouter = require("./private/routes/roles.router");


// Usar rutas con prefijos
app.use("/auth", authRouter);
app.use("/clientes", clientesRouter);
app.use("/galeria", galeriaRouter);
app.use("/cervezas", cervezasRouter);
app.use("/provincias", provinciasRouter);
app.use("/generos", generosRouter);
app.use("/user", userRouter);
app.use("/roles", rolesRouter);


// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

// Ruta para servir la página de inicio de sesión (login.html)
app.get("/login", (req, res) => {
  // sendFile() envía un archivo estático al cliente como respuesta.
  // path.join() une las rutas de manera adecuada para diferentes sistemas operativos.
  // __dirname se refiere al directorio base del proyecto.

  res.sendFile(path.join(__dirname, "views/login.html"));
});

// Ruta para servir la página de registro (registro.html)
app.get("/registro", (req, res) => {
  res.sendFile(path.join(__dirname, "views/registro.html"));
});

app.get("/admin",verificarToken, verifyRole("admin"), (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin/admin.html"));
});

app.get("/gestionUsuarios", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin/gestionUsuarios.html"));
});
app.get("/gestionGaleria",  (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin/gestionGaleria.html"));
});
app.get("/gestionProvincias", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin/gestionProvincias.html"));
});
app.get("/gestionGeneros",  (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin/gestionGeneros.html"));
});

app.get("/gestionRoles", (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin/gestionRoles.html"));
});
app.get("/gestionCervezas",  (req, res) => {
  res.sendFile(path.join(__dirname, "views/admin/gestionCervezas.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "views/usuario/dashboard.html"));
});

// console.log("Ruta del archivo HTML:", path.join(__dirname, "views/usuario/dashboard.html"));


app.get("/acercaDe", (req, res) => {
  res.sendFile(path.join(__dirname, "views/acercaDe.html"));
});

app.get("/contacto", (req, res) => {
  res.sendFile(path.join(__dirname, "views/contacto.html"));
});

app.get("/historia", (req, res) => {
  res.sendFile(path.join(__dirname, "views/historia.html"));
});

app.get("/nuestrosClientes", (req, res) => {
  res.sendFile(path.join(__dirname, "views/clientes.html"));
});
app.get("/sucursales", (req, res) => {
  res.sendFile(path.join(__dirname, "views/sucursales.html"));
});

app.post("/auth/logout", (req, res) => {
  res.clearCookie("jwt", { path: "/" }); // Elimina la cookie JWT
  res.status(200).json({ mensaje: "Sesión cerrada correctamente" });
});

// const crypto = require('crypto');
// const secretKey = crypto.randomBytes(64).toString('hex');
// console.log(secretKey);

// Configuracion server puerto
const PORT = process.env.PORT || 3001;
// console.log(`Usando el puerto: ${PORT}`);

app.listen(PORT, () =>
  console.log(`Servidor corriendo en: http://localhost:${PORT}`)
);


