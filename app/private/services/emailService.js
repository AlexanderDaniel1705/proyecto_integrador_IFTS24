const nodemailer = require("nodemailer");

async function enviarEmail(usuario, email, contraseñaTemporal) {
    // Configurar el transporte SMTP
    const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
            user: process.env.EMAIL_OWNER, // Correo desde el que se enviará
            pass: process.env.EMAIL_PASSWORD, // Contraseña o token de aplicación
        },
    });

    // Crear el contenido del correo
    const mailOptions = {
        from: '"Soporte Plataforma" <elbolson@gmail.com>', // Remitente
        to: email, // Destinatario
        subject: "Bienvenido a El Bolsón",
        html: `
            <h1>Hola, ${usuario}!</h1>
            <p>Estas son tus credenciales temporales:</p>
            <ul>
                <li><strong>Nombre de usuario:</strong> ${usuario}</li>
                <li><strong>Contraseña temporal:</strong> ${contraseñaTemporal}</li>
            </ul>
            <p>Por favor, utiliza el siguiente enlace para iniciar sesión:</p>
            <p><a href="http://localhost:3000/login" target="_blank" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Iniciar sesión</a></p>
            <p>Recuerda cambiar tu contraseña después de iniciar sesión.</p>
        `,
    };

    // Intentar enviar el correo
    for(let i = 0; i < 3; i++) {
        try {
            await transporter.sendMail(mailOptions);
            console.log("Correo enviado exitosamente a:", email);
            break;
        } catch (error) {
            if ( i ===2) {//si falla despues de tres intentos
                console.error("Error al enviar el correo:", error);
                throw new Error("No se pudo enviar el correo.");
                }
            }
        }
};
    

module.exports = enviarEmail;