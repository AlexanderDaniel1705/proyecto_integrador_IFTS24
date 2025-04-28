const mysql = require('mysql2'); // Cliente MySQL
const dotenv = require("dotenv");
const path = require("path"); // Para manejar rutas

// dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// console.log("DB_HOST:", process.env.DB_HOST);
// console.log("DB_USER:", process.env.DB_USER);
// console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
// console.log("DB_NAME:", process.env.DB_NAME);

// Crear la conexión a la base de datos
const connection = mysql.createConnection({
    host: process.env.DB_HOST , // Dirección del servidor de la base de datos.
    user: process.env.DB_USER ,// Nombre de usuario para autenticar en la base de datos.
    password: process.env.DB_PASSWORD ,// Contraseña del usuario para autenticar en la base de datos.
    database: process.env.DB_NAME// Nombre de la base de datos a la que se conecta.
});

// Verificar la conexión
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.message);
        console.log('Detalles del error:', JSON.stringify(err, null, 2));
        process.exit(1);
    }
    console.log('Conexión exitosa a la base de datos');
});

// Exportar conexión
module.exports = connection;
