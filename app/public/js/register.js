
  // Restricciones para el nombre: Solo letras con acentos, sin números ni espacios
  document.querySelector("#name").addEventListener("input", function(event) {
    const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$/; // Solo letras con acentos
    if (!regexNombre.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ]/g, "");
    }
  });

  // Restricciones para el apellido: Solo letras con acentos y espacios
  document.querySelector("#lastname").addEventListener("input", function(event) {
    const regexApellido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Letras con acentos y espacios
    if (!regexApellido.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    }
  });

  document.querySelector("#user").addEventListener("blur", function(event){
    const usuario = event.target.value.trim();
    const errorUsuario = document.querySelector(".errorUsuario")

    if (usuario.length < 8) {
        errorUsuario.textContent = "El usuario debe contener al menos 8 caracteres.";
        errorUsuario.classList.remove("escondido");
    }else {
        errorUsuario.textContent= "";
        errorUsuario.classList.add("escondido");
    }
  })

  document.querySelector("#fechaNac").addEventListener("blur", function(event) {
    //El evento blur se activa cuando el usuario pierde el foco del elemento 
    const fechaNacInput = event.target.value.trim();
    //event.target: Representa el elemento que disparó el evento

    const errorFecha = document.querySelector(".errorFecha");

    // Crear un objeto Date con la fecha ingresada
    const fechaNac = new Date(fechaNacInput);

    // Validar si la fecha es válida
    if (isNaN(fechaNac.getTime())) {
        errorFecha.textContent = "Por favor, ingresá una fecha válida.";
        errorFecha.classList.remove("escondido");
        setTimeout(() => {
            errorFecha.classList.add("escondido");
    },4000);
        return; // Detener el flujo si la fecha no es válida
    }

    const hoy = new Date();
    //Este objeto contiene información sobre el año, mes, día, hora, minuto,
    //  segundo, etc., del momento exacto en que se ejecuta el código.
    const edadMinima = 18;

    // Crear el límite de edad
    const limiteEdad = new Date(hoy.getFullYear() - edadMinima, hoy.getMonth(), hoy.getDate());
    //Crea un nuevo objeto Date utilizando los valores calculados
    //representa el límite exacto de nacimiento que cumple con la edad mínima.

    // Validar si la fecha es futura
    if (fechaNac > hoy) {
        errorFecha.textContent = "La fecha de nacimiento no puede ser futura.";
        errorFecha.classList.remove("escondido");
        setTimeout(() => {
            errorFecha.classList.add("escondido");
    },4000);
        return; // Detener el flujo si la fecha es futura
    }

    // Validar si el usuario cumple la edad mínima
    if (fechaNac > limiteEdad) {
        errorFecha.textContent = `Debes tener al menos ${edadMinima} años para poder registrarte.`;
        errorFecha.classList.remove("escondido");
        setTimeout(() => {
            errorFecha.classList.add("escondido");
    },4000);
        return; // Detener el flujo si no cumple la edad mínima
    }

    // Si todo es válido, limpiar el mensaje de error
    errorFecha.textContent = "";
    errorFecha.classList.add("escondido");
});

  document.querySelector("#email").addEventListener("blur", function(event) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorEmail = document.querySelector(".errorEmail") ;

    if ( !emailRegex.test(event.target.value) ) {
        errorEmail.textContent = "Formato de email incorrecto.";
        errorEmail.classList.remove("escondido");
    } else{
        errorEmail.textContent="";
        errorEmail.classList.add("escondido");
    }
  });


const passwordInput = document.querySelector("#password");
const confirmPasswordInput = document.querySelector("#confirmPassword");

const togglePasswordIcon = document.querySelector("#togglePassword");

const toggleConfirmPasswordIcon = document.querySelector("#toggleConfirmPassword");

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

toggleConfirmPasswordIcon.addEventListener("click", () => {
  
  // Verifica el atributo "type" del campo de contraseña:
  // Si es "password", lo cambia a "text" para mostrar la contraseña.
  // Si es "text", lo cambia a "password" para ocultarla.
  const tipo = confirmPasswordInput.getAttribute("type") === "password" ? "text" : "password";

  // Aplica el nuevo valor al atributo "type" del campo de contraseña
  confirmPasswordInput.setAttribute("type", tipo);

  // Cambiar el ícono según el estado actual:
  if (tipo === "password") {
    // Si el tipo es "password" (contraseña oculta):
    // 1. Elimina la clase "fa-eye" (ojo abierto).
    toggleConfirmPasswordIcon.classList.remove("fa-eye");
    
    // 2. Agrega la clase "fa-eye-slash" (ojo cerrado).
    toggleConfirmPasswordIcon.classList.add("fa-eye-slash");
  } else {
    // Si el tipo es "text" (contraseña visible):
    // 1. Elimina la clase "fa-eye-slash" (ojo cerrado).
    toggleConfirmPasswordIcon.classList.remove("fa-eye-slash");
    
    // 2. Agrega la clase "fa-eye" (ojo abierto).
    toggleConfirmPasswordIcon.classList.add("fa-eye");
  }
});


const errorPassword = document.querySelector(".errorPassword");
const btnRegistro = document.querySelector(".btnRegistro");

 // Función para verificar las contraseñas
 function validatePasswords() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // if (password === confirmPassword) {
    //     errorPassword.textContent = "Las contraseñas coinciden."; // Mensaje positivo
    //     errorPassword.style.color = "green"; // Color verde
    //   } 
    if (password !== confirmPassword) {
        errorPassword.textContent = "Las contraseñas no coinciden."; // Mensaje de error
        // errorPassword.style.color = "red"; // Color rojo
      } if (password === confirmPassword){
        errorPassword.textContent = ""; // Limpia el mensaje si coinciden
      }
  
    };

  // Añadir eventos para verificar contraseñas mientras el usuario escribe
  passwordInput.addEventListener("input", validatePasswords);
  confirmPasswordInput.addEventListener("input", validatePasswords);




document.querySelector("#register-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Crear un objeto FormData para manejar los datos del formulario, incluyendo el archivo
    const formData = new FormData(e.target); // Aca se capturan todos los datos del formulario directamente


    //capturar los valores especificos del formulario
    const nombre= formData.get("nombre").trim();
    const apellido= formData.get("apellido").trim();

    const usuario = formData.get("usuario");
    // Validación de nombre de usuario con al menos 8 caracteres
    if (usuario.length < 8) {
        console.log("El usuario de usuario debe tener al menos 8 caracteres.");
        return; // Detiene el envío si no pasa la validación
    }

    //trasnformar los valores
    const nombreTransformado = capitalizarTexto(nombre);
    const apellidoTransformado = capitalizarTexto(apellido);
    //Actualizar los valores transformados en la FormData
    formData.set("nombre", nombreTransformado);
    formData.set("apellido", apellidoTransformado)

    // Convertir la fecha a formato YYYY-MM-DD si es necesario
    const fechaNacimiento = new Date(formData.get("fecha_nacimiento")).toISOString().split("T")[0];
    formData.set("fecha_nacimiento", fechaNacimiento); // Actualizar el valor en FormData


    const mensajeError = document.querySelector(".error");

    try {
        
        const res = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            body: formData, // Envía el FormData directamente
        });

        if (!res.ok) {
            mensajeError.classList.remove("escondido");
            console.error("Error al registrar:", await res.text());
            return;
        } 

        const resJson = await res.json();
        console.log(resJson);

        // Redirigir o mostrar mensaje según la respuesta
        if (resJson.redirect) {
            window.location.href = resJson.redirect;
        } else {
            alert(resJson.mensaje || "Registro fallido.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un problema al registrar. Intenta de nuevo más tarde.");
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const provinciasSelect = document.querySelector("#provincias");

    try {
        // Solicitud al backend para obtener las provincias
        const response = await fetch("http://localhost:3000/provincias"); 
        const provincias = await response.json();

        // Rellenar el select con las provincias
        provincias.forEach(provincia => {
            const option = document.createElement("option");
            option.value = provincia.id_provincia; 
            option.textContent = provincia.nombre_provincia; // Nombre de la provincia
            provinciasSelect.appendChild(option);

        });
    } catch (error) {
        console.error("Error al cargar las provincias:", error);
    }
});


document.addEventListener("DOMContentLoaded", async () => {
    const generosSelect = document.querySelector("#generos");

    try {
        const response = await fetch("http://localhost:3000/generos"); 
        const generos = await response.json();

        // Rellenar el select con los generos
        generos.forEach(genero => {
            const option = document.createElement("option");
            option.value = genero.id_genero;
            option.textContent = genero.nombre_genero; 
            generosSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar los generos:", error);
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const rolesSelect = document.querySelector("#rol_usuario");

    try {
        const response = await fetch("http://localhost:3000/roles");
        const roles = await response.json();

        roles.forEach(roles => {
            const option =document.createElement("option");
            option.value = roles.id_rol;
            option.textContent = roles.nombre_rol;
            rolesSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar los roles", error);
    }
});

    //Funcion para capitalizar texto
    function capitalizarTexto(texto){
        return texto
        .trim()
        .split(" ")//dividir en palabras
        .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())//primera letra en mayuscula
        .join(" ");//Unir las palabras con espacios
    }
 
