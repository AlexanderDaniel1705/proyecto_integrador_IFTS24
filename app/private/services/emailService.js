// Importa el módulo 'nodemailer' para enviar correos electrónicos
const nodemailer = require("nodemailer");

// Define una función asíncrona para enviar un correo electrónico
async function enviarEmail(usuario, email, contraseñaTemporal) {

    // Configura el transporte SMTP para la conexión con el servidor de correos
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", // Servidor SMTP de Gmail
        port: 587, // Puerto 587 es el recomendado para conexiones TLS
        secure: false, // No usar SSL en el puerto 587 (usare TLS más abajo)

        // Autenticación con las credenciales almacenadas en variables de entorno
        auth: {
            user: process.env.EMAIL_OWNER, // Dirección de correo electrónico remitente
            pass: process.env.EMAIL_PASSWORD, // Contraseña o token de aplicación
        },

        // Configuración adicional para evitar problemas con certificados autofirmados
        tls: {
            rejectUnauthorized: false, // Desactiva la verificación de certificados
        },
    });

    // Configuro el contenido del correo
    const mailOptions = {
        from: '"Soporte Plataforma" <elbolson@gmail.com>', // Remitente del correo
        to: email, // Dirección del destinatario
        subject: "Bienvenido a El Bolsón", // Asunto del correo
        html: ` 
            <h1>Hola, ${usuario}!</h1>
            <p>Estas son tus credenciales temporales:</p>
            <ul>
                <li><strong>Nombre de usuario:</strong> ${usuario}</li>
                <li><strong>Contraseña temporal:</strong> ${contraseñaTemporal}</li>
            </ul>
            <p>Por favor, utiliza el siguiente enlace para iniciar sesión:</p>
            <p><a href="http://localhost:3000/login" target="_blank" style="background-color: #007bff; 
                color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Iniciar sesión</a></p>
            <p>Recuerda cambiar tu contraseña después de iniciar sesión.</p>
        `,
    };

    // Intento enviar el correo hasta 3 veces en caso de fallos
    for(let i = 0; i < 3; i++) {
        try {
            await transporter.sendMail(mailOptions); // Intento enviar el correo
            console.log("Correo enviado exitosamente a:", email); // Mensaje de éxito
            break; // Si el correo se envía correctamente, se detiene el bucle
        } catch (error) {
            if (i === 2) { // Si falla en el tercer intento
                console.error(`Intento ${i + 1}: Fallo en envío de correo →`, error.message);
                console.error("Error al enviar el correo:", error);
                throw new Error("No se pudo enviar el correo."); // Lanza un error después de 3 intentos fallidos
            }
        }
    }
};

// Exporto la función para que pueda utilizarla en user.controller.js
module.exports = enviarEmail;