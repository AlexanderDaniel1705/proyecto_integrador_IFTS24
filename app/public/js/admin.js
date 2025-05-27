// Cierra sesión al hacer clic en el botón de logout
document.querySelector(".btn-log-out").addEventListener("click", () => {
    fetch("/auth/logout", { method: "POST" }) // Llama al servidor para eliminar la sesión
      .then(() => {
        sessionStorage.clear(); // Borra los datos del usuario almacenados en sessionStorage
        window.location.replace("/"); // Redirige al usuario a la página principal
      });
});



  

// -----------------------------------------------------

// --- Interacciones de la Barra Lateral y Menú ---
// Selección de elementos del DOM para la interfaz de la barra lateral.
const img = document.querySelector(".img-logo"); // Logo de la aplicación
const barraLateral = document.querySelector(".barra-lateral"); // Barra lateral de navegación
const spans = document.querySelectorAll("span"); // Elementos de texto dentro de la barra lateral
const menu = document.querySelector(".menu"); // Botón de menú para expandir/contraer la barra lateral
const main = document.querySelector("#main-content"); // Contenedor principal de la página

// Evento para minimizar/expandir  la barra lateral al hacer clic en el logo
img.addEventListener("click", () => {
    barraLateral.classList.toggle("mini-barra-lateral"); // Alterna clase para minimizar la barra lateral
    main.classList.toggle("min-main"); // Ajusta el contenido principal para la vista reducida
    spans.forEach((span) => {
        span.classList.toggle("oculto"); // Oculta los textos si la barra está minimizada
    });
});

// Evento para expandir o contraer la barra lateral al hacer clic en el botón de menú
menu.addEventListener("click", () => {
    barraLateral.classList.toggle("max-barra-lateral"); // Alterna la clase para expandir la barra lateral

    // Cambia el icono del botón de menú según el estado de la barra lateral
    if(barraLateral.classList.contains("max-barra-lateral")){
        menu.children[0].style.display="none"; // Oculta el icono de menú cerrado
        menu.children[1].style.display="block"; // Muestra el icono de menú abierto
    }
    else {
        menu.children[0].style.display="block"; // Muestra el icono de menú cerrado
        menu.children[1].style.display="none"; // Oculta el icono de menú abierto
    }

    // Ajuste especial para dispositivos pequeños (menos de 320px de ancho)
    if(window.innerWidth <= 320){
        barraLateral.classList.add("mini-barra-lateral");
        main.classList.add("min-main");
        spans.forEach((span) => {
            span.classList.add("oculto"); // Oculta los textos en pantallas pequeñas
        });
    }
});

// Evento que se ejecuta cuando el DOM está completamente cargado
// Se utiliza para mostrar los datos del perfil del usuario si están almacenados en sessionStorage
document.addEventListener("DOMContentLoaded", () => {
    // Recuperar los datos del usuario desde sessionStorage
    const user = JSON.parse(sessionStorage.getItem('user')); // Convierte el JSON guardado en un objeto

    if (user) { // Si hay datos del usuario almacenados
        // Actualizar la interfaz con los datos del usuario
        document.getElementById('user-name').textContent = user.usuario;   // Muestra el nombre del usuario en el elemento correspondiente
        document.getElementById('user-email').textContent = user.email;   // Muestra el correo electrónico
        document.getElementById('user-image').src = user.imageUrl || '/uploads/default.png'; // Establece la imagen de perfil, usa una predeterminada si no hay imagen
        document.getElementById('user-image').alt = `Imagen de ${user.usuario}`; // Agrega texto alternativo para accesibilidad
        console.log(user); // Muestra los datos del usuario en la consola para depuración
    } else { // Si no hay datos almacenados en sessionStorage
        console.log("No se encontraron datos del usuario."); // Mensaje en la consola para indicar que no hay información disponible
    }
});

// -----------------------------------------------------

// Carga dinámica de Bootstrap si aún no está presente en la página
if (!document.querySelector(`script[src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"]`)) {
    const bootstrapScript = document.createElement("script");
    bootstrapScript.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js";
    bootstrapScript.defer = true; // Carga el script de forma asíncrona
    document.body.appendChild(bootstrapScript); // Agrega el script a la página
}

// Carga dinámica de Alertify.js si aún no está presente en la página
if (!document.querySelector(`script[src="//cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"]`)) {
    const alertifyScript = document.createElement("script");
    alertifyScript.src = "//cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js";
    alertifyScript.defer = true; // Carga el script de forma asíncrona
    document.body.appendChild(alertifyScript); // Agrega el script a la página
}

// -----------------------------------------------------

// Función asíncrona para cargar una sección de la página
async function cargarSeccion(url, scriptPath, funcionCarga) {
    try {
        // Petición para obtener el contenido HTML de la sección.
        const response = await fetch(url); 
        // Si la respuesta no es OK, lanzar un error.
        if (!response.ok) throw new Error(`Error al cargar la sección: ${url}`); 

        console.log(url); // Muestra la URL solicitada en la consola
        console.log(scriptPath); // Muestra el script asociado a la sección

        const html = await response.text(); // Obtiene el HTML de la respuesta
        // Selecciona el contenedor principal donde se insertará el HTML.
        const mainContainer = document.querySelector("#main-content");

        if (!mainContainer) {
            console.error("Error: No se encontró el elemento <main id='main-content'> en el DOM.");
            return;
        }
        // Verifica si la sección ya está cargada para evitar recargar innecesariamente
        if (mainContainer.dataset.currentSection === url) {
            console.log("La sección ya está cargada. No se volverá a cargar.");
            return;
        }

        // Reemplaza el contenido del contenedor principal con el nuevo HTML de la sección.
        // ESTO DESTRUYE Y RECREA TODO EL DOM DENTRO DE mainContainer.
        mainContainer.innerHTML = html; 
        // Actualiza el `dataset` para marcar qué sección está ahora cargada.
        mainContainer.dataset.currentSection = url; // Marca la sección actual

        // Cargar el script asociado a la sección de forma segura
        const modulo = await import(scriptPath).catch(error => {
            console.error(`Error al importar el módulo: ${scriptPath}`, error);
            if (mainContainer) mainContainer.innerHTML = 
            `<p>Error crítico al cargar el script para ${url}. Revise la consola.</p>`;
            return null; 
        });

        // Ejecutar la función de carga si existe
        if (modulo && typeof modulo[funcionCarga] === "function") {
            modulo[funcionCarga](); 
        } else {
            console.error(`La función '${funcionCarga}' no se pudo encontrar o no es una función en el módulo '${scriptPath}'.`);
            if (mainContainer && !modulo) { // Si el módulo no cargó, el error ya se mostró.
                // No hacer nada más para evitar sobreescribir el mensaje de error de importación.
            } else if (mainContainer) {
                mainContainer.innerHTML = `<p>Error al inicializar la sección ${url}: función de carga no encontrada.</p>`;
            }

        }

    } catch (error) {// Captura errores de la petición fetch o cualquier otro error en el bloque try.
        console.error("Error:", error); // Captura y muestra errores en la consola
         // Intentar mostrar el error en el contenedor principal si aún es accesible.
         const mainElementForError = document.querySelector("#main-content"); 
         if (mainElementForError) {
             mainElementForError.innerHTML = `<p>Error al cargar la sección ${url}. Detalles: ${error.message}</p>`;
         }
 
    }
}

// -----------------------------------------------------

// Carga la sección de gestión de usuarios al hacer clic en el botón correspondiente
document.querySelector(".btnGestionUsuarios").addEventListener("click", async () => {
    await cargarSeccion("/gestionUsuarios", "/js/gestionUsuarios.js", "cargarUsuarios");
    document.dispatchEvent(new Event("seccionGestionUsuariosCargada")); // Evento personalizado
});

// Carga la sección de gestión de galería al hacer clic en el botón correspondiente
document.querySelector(".btnGestionGaleria").addEventListener("click", async () => {
    await cargarSeccion("/gestionGaleria", "/js/gestionGaleria.js", "cargarGaleria");
    document.dispatchEvent(new Event("seccionGestionGaleriaCargada")); // Evento personalizado
});

// Carga la sección de gestión de provincias al hacer clic en el botón correspondiente
document.querySelector(".btnGestionProvincias").addEventListener("click", async () => {
    await cargarSeccion("/gestionProvincias", "/js/gestionProvincias.js", "cargarProvincias");
    document.dispatchEvent(new Event("seccionGestionProvinciasCargada")); // Evento personalizado
});

// Carga la sección de gestión de géneros al hacer clic en el botón correspondiente
document.querySelector(".btnGestionGeneros").addEventListener("click", async () => {
    await cargarSeccion("/gestionGeneros", "/js/gestionGeneros.js", "cargarGeneros");
    document.dispatchEvent(new Event("seccionGestionGenerosCargada")); // Evento personalizado
});

// Carga la sección de gestión de géneros al hacer clic en el botón correspondiente
document.querySelector(".btnGestionRoles").addEventListener("click", async () => {
    await cargarSeccion("/gestionRoles", "/js/gestionRoles.js", "cargarRoles");
    document.dispatchEvent(new Event("seccionGestionRolesCargada")); // Evento personalizado
});

// Carga la sección de gestión de cervezas al hacer clic en el botón correspondiente
document.querySelector(".btnGestionCervezas").addEventListener("click", async () => {
    await cargarSeccion("/gestionCervezas", "/js/gestionCervezas.js", "cargarCervezas");
    document.dispatchEvent(new Event("seccionGestionCervezasCargada")); // Evento personalizado
});