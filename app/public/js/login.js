// Agregar un evento al formulario de login cuando se envía
document.querySelector("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que el formulario se envíe y recargue la página

    const mensajeError = document.querySelector(".error"); // Obtiene el elemento que muestra errores
    const userInput = document.querySelector("#user").value.trim(); // Obtiene y limpia espacios del usuario ingresado
    const passwordInput = document.querySelector("#password").value.trim(); // Obtiene y limpia espacios de la contraseña ingresada

    // Validar que los campos no estén vacíos
    if (!userInput || !passwordInput) {
        mensajeError.textContent = "Por favor, completá todos los campos."; // Muestra un mensaje de error
        mensajeError.classList.remove("escondido"); // Hace visible el mensaje de error

        // Oculta el mensaje de error después de 4 segundos
        setTimeout(() => {
            mensajeError.classList.add("escondido");
        }, 4000);

        return; // Detiene la ejecución del código si los campos están vacíos
    }

    // Creación del objeto con los datos del usuario
    const data = {
        usuario: userInput,
        contrasenia: passwordInput
    };

    console.log("Datos enviados:", data); // Muestra los datos enviados en la consola

try {
    // Detecta automáticamente si estoy en localhost o usando un túnel como ngrok
    const baseURL = window.location.origin.includes("localhost")
        ? "http://localhost:3000"
        : "https://6886-2800-40-80-1b5c-c591-4908-2da9-5706.ngrok-free.app"; 

    // Realiza la solicitud al servidor para iniciar sesión
    const res = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include" //  necesario para usar cookies/sesiones con ngrok
    });


        const resJson = await res.json(); // Convierte la respuesta del servidor en JSON
        console.log(resJson); // Muestra la respuesta del servidor en la consola

        // Si la respuesta no es exitosa, muestra el error
        if (!res.ok) {
            mensajeError.textContent = resJson.error || "Usuario y/o contraseñas incorrectos"; // Muestra mensaje de error
            mensajeError.classList.remove("escondido"); // Hace visible el mensaje
            setTimeout(() => {
                mensajeError.classList.add("escondido"); // Oculta el mensaje después de 4 segundos
            }, 4000);
            return; // Detiene la ejecución si hay un error
        }

        // Almacena los datos del usuario en sessionStorage si existen en la respuesta
        //viene del conmtroller para despues ser llamados en admin cuando inicie sesion y los muestre
        //en pantalla
        if (resJson.user) {
            sessionStorage.setItem('user', JSON.stringify(resJson.user)); // Convierte el objeto usuario en string y lo guarda
        }
        if (resJson.token) {
            sessionStorage.setItem('token', resJson.token); // Guarda el token para usarlo después
        }


        // Redirige al usuario según el rol especificado en la respuesta
        if (resJson.redirect) {
            window.location.href = resJson.redirect; // Redirige a la página correspondiente
        } else {
            console.log(resJson.mensaje || "Inicio de sesión fallido."); // Muestra un mensaje si no hay redirección
        }
    } catch (error) {
        console.error("Error en la solicitud:", error); // Muestra el error en la consola
        mensajeError.textContent = "Error al conectar con el servidor. Intenta más tarde"; // Muestra mensaje de error por conexión
        mensajeError.classList.remove("escondido"); // Hace visible el mensaje
        setTimeout(() => {
            mensajeError.classList.add("escondido"); // Oculta el mensaje después de 4 segundos
        }, 4000);
    }
});

// -----------------------------------------------------

const passwordInput = document.querySelector("#password"); // Obtiene el campo de contraseña
const togglePasswordIcon = document.querySelector("#togglePassword"); // Obtiene el icono que alterna la visibilidad

// Evento para alternar la visibilidad de la contraseña cuando el usuario hace clic en el icono
togglePasswordIcon.addEventListener("click", () => {
    // Verifica el estado actual del campo de contraseña
    const tipo = passwordInput.getAttribute("type") === "password" ? "text" : "password";

    // Cambia el atributo del input para mostrar/ocultar la contraseña
    passwordInput.setAttribute("type", tipo);

    // Cambia el ícono según si la contraseña está visible o no
    if (tipo === "password") {
        // Si el tipo es "password", oculta la contraseña y cambia el icono a "cerrado"
        togglePasswordIcon.classList.remove("fa-eye"); // Quita el ícono de ojo abierto
        togglePasswordIcon.classList.add("fa-eye-slash"); // Agrega el ícono de ojo cerrado
    } else {
        // Si el tipo es "text", muestra la contraseña y cambia el icono a "abierto"
        togglePasswordIcon.classList.remove("fa-eye-slash"); // Quita el ícono de ojo cerrado
        togglePasswordIcon.classList.add("fa-eye"); // Agrega el ícono de ojo abierto
    }
});
// Limpiar los campos de usuario y contraseña al cargar la página
window.onload = () => {
    const usernameInput = document.getElementById("user"); // 
    const passwordInput = document.getElementById("password");

    if (usernameInput) usernameInput.value = "";
    if (passwordInput) passwordInput.value = "";
};

