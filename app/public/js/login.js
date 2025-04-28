document.querySelector("#login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const mensajeError = document.querySelector(".error"); 
    const userInput = document.querySelector("#user").value.trim();
    const passwordInput = document.querySelector("#password").value.trim();
    
    // Validar que los campos no estén vacíos
    if (!userInput || !passwordInput) {
        mensajeError.textContent = "Por favor, completá todos los campos.";
        mensajeError.classList.remove("escondido");
    
        // Ocultar el mensaje después de 4 segundos
        setTimeout(() => {
            mensajeError.classList.add("escondido");
        }, 4000);
    
        return;
    }
        // Creación del objeto con los datos
        const data = {
            usuario: userInput,
            contrasenia: passwordInput
        };
    
        console.log("Datos enviados:", data); // Para verificar en la consola


try {

    const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" 
        },
        body: JSON.stringify(data)
    });

    const resJson = await res.json();
    console.log(resJson);

    if (!res.ok) {
        
        mensajeError.textContent = resJson.error || "Usuario y/o contraseñas incorrectos";
        mensajeError.classList.remove("escondido");
        setTimeout(() => {
            mensajeError.classList.add("escondido");
        },4000);
        return;
    }



    if (resJson.redirect) {
        window.location.href = resJson.redirect;
    } else {
        console.log(resJson.mensaje || "Inicio de sesión fallido.");
    }


        }  catch(error){
            console.error("Error en la solicitud:", error);
            mensajeError.textContent = "Error al conectra con el servidor. Intenta más tarde";
            mensajeError.classList.add("escondido");
            setTimeout(() => {
                mensajeError.classList.add("escondido");
        },4000);

    }
});

const passwordInput = document.querySelector("#password");;

const togglePasswordIcon = document.querySelector("#togglePassword");


// //funcion para alterar la  visivilidd de las contraseñas


togglePasswordIcon.addEventListener("click", () => {
  
  // Verifica el atributo "type" del campo de contraseña:
  // Si es "password", lo cambia a "text" para mostrar la contraseña.
  // Si es "text", lo cambia a "password" para ocultarla.
  const tipo = passwordInput.getAttribute("type") === "password" ? "text" : "password";

  // Aplica el nuevo valor al atributo "type" del campo de contraseña
  passwordInput.setAttribute("type", tipo);

  // Cambiar el ícono según el estado actual:
  if (tipo === "password") {
    // Si el tipo es "password" (contraseña oculta):
    // 1. Elimina la clase "fa-eye" (ojo abierto).
    togglePasswordIcon.classList.remove("fa-eye");
    
    // 2. Agrega la clase "fa-eye-slash" (ojo cerrado).
    togglePasswordIcon.classList.add("fa-eye-slash");
  } else {
    // Si el tipo es "text" (contraseña visible):
    // 1. Elimina la clase "fa-eye-slash" (ojo cerrado).
    togglePasswordIcon.classList.remove("fa-eye-slash");
    
    // 2. Agrega la clase "fa-eye" (ojo abierto).
    togglePasswordIcon.classList.add("fa-eye");
  }
});

