document.querySelector(".btn-log-out").addEventListener("click",() =>{
    document.cookie='jwt=; Path=/ Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.location.href = "/"
})



        // -----------------------------------------------------

        const img = document.querySelector(".img-logo");
        const barraLateral = document.querySelector(".barra-lateral");
        const spans = document.querySelectorAll("span");
        const menu = document.querySelector(".menu");
        const main = document.querySelector("main");

        img.addEventListener("click", () => {
            barraLateral.classList.toggle("mini-barra-lateral");
            main.classList.toggle("min-main");
            spans.forEach((span) => {
                span.classList.toggle("oculto");
            });
        });

        menu.addEventListener("click", () => {
            barraLateral.classList.toggle("max-barra-lateral");
            if(barraLateral.classList.contains("max-barra-lateral")){
                menu.children[0].style.display="none";
                menu.children[1].style.display="block";
            }
            else {
                menu.children[0].style.display="block";
                menu.children[1].style.display="none";
            }
            if(window.innerWidth<=320){
                barraLateral.classList.add("mini-barra-lateral");
                main.classList.add("min-main");
                spans.forEach((span) => {
                    span.classList.add("oculto")
                })
            }
        });

        document.addEventListener("DOMContentLoaded", () => {
            // Recuperar los datos del usuario del sessionStorage
            const user = JSON.parse(sessionStorage.getItem('user'));
        
        
        if (user) {
            // Actualizar los elementos con los datos del usuario
            document.getElementById('user-name').textContent = user.usuario;   // Nombre de usuario
            document.getElementById('user-email').textContent = user.email;   // Correo electrónico
            document.getElementById('user-image').src = user.imageUrl || '/uploads/default.png'; // Imagen de perfil
            document.getElementById('user-image').alt = `Imagen de ${user.usuario}`; // Texto alternativo para la imagen
            console.log(user); 
        } else {
            console.log("No se encontraron datos del usuario.");
        }
    });
  

        //  // Importacion Gestion usuarios
        // document.querySelector(".btnGestionUsuarios").addEventListener("click", async () => {
        //     // const mainContent = document.getElementById("main-content");
        
        //     try {
        //         // Cargar el contenido de `gestionUsuarios.html` dentro del main
        //         const response = await fetch("/gestionUsuarios");
        //         if (!response.ok) throw new Error("Error al cargar la página de gestión");
        
        //         const html = await response.text();
        //         main.innerHTML = html;
        
        //         // Importar el script de gestión de usuarios dinámicamente
        //         const {cargarUsuarios} = await import("/js/gestionUsuarios.js").catch(console.error);

        //          // Volver a ejecutar la función para cargar usuarios
        //         cargarUsuarios();

        //     } catch (error) {
        //         console.error("Error:", error);
        //         main.innerHTML = "<p>Error al cargar Gestión de Usuarios</p>";
        //     }
        // });
            // document.querySelector(".btnGestionGaleria").addEventListener("click", async () => {
        //     // const mainContent = document.getElementById("main-content");
        
        //     try {
        //         // Cargar el contenido de `gestionUsuarios.html` dentro del main
        //         const response = await fetch("/gestionGaleria");
        //         if (!response.ok) throw new Error("Error al cargar la página de gestión");
        
        //         const html = await response.text();
        //         main.innerHTML = html;
        
        //         // Importar el script de gestión de usuarios dinámicamente
        //         const {cargarGaleria} = await import("/js/gestionGaleria.js").catch(console.error);

        //          // Volver a ejecutar la función para cargar usuarios
        //         cargarGaleria();

        //     } catch (error) {
        //         console.error("Error:", error);
        //         main.innerHTML = "<p>Error al cargar Gestión de Galeria</p>";
        //     }
        // });

        // async function cargarSeccion(url, scriptPath, funcionCarga) {
        //     try {
        //         const response = await fetch(url);
        //         if (!response.ok) throw new Error(`Error al cargar la sección: ${url}`);
        
        //         const html = await response.text();
        
        //         // Crear un contenedor temporal para construir el contenido
        //         const contenedor = document.createElement("div");
        //         contenedor.innerHTML = html;
        
        //         // Reemplaza el contenido de `main` completamente
        //         main.replaceChildren(...contenedor.children);
        
        //         // Importar el script de forma segura
        //         const modulo = await import(scriptPath).catch(console.error);
        
        //         if (modulo && typeof modulo[funcionCarga] === "function") {
        //             modulo[funcionCarga]();
        //         } else {
        //             console.error(`La función ${funcionCarga} no se pudo ejecutar.`);
        //         }
        //     } catch (error) {
        //         console.error("Error:", error);
        //         main.replaceChildren(document.createElement("p").textContent = `Error al cargar ${url}`);
        //     }
        // }

         // document.addEventListener("DOMContentLoaded", () => {
        //     if (window.location.pathname.includes("/gestionUsuarios")) {
        //         cargarUsuarios();
        //     } else if (window.location.pathname.includes("/gestionGaleria")) {
        //         cargarGaleria();
        //     }
        // });
        // document.querySelector(".btnGestionGaleria").addEventListener("click", async (e) => {
        //     const boton = e.currentTarget;
        //     boton.disabled = true;
        
        //     try {
        //         console.log("Cargando galería...");
        //         await cargarGaleria();
        //         console.log("Galería cargada.");
        //     } catch (error) {
        //         console.error("Error al cargar la galería:", error);
        //     } finally {
        //         boton.disabled = false;
        //     }
        // });
        // document.querySelector(".btnGestionGaleria").addEventListener("click", async (e) => {
        //     const boton = e.currentTarget;
        //     boton.disabled = true; // Deshabilita el botón
        
        //     try {
        //         await cargarSeccion("/gestionGaleria", "/js/gestionGaleria.js", "cargarGaleria");
        //     } catch (error) {
        //         console.error("Error al cargar la galería:", error);
        //     } finally {
        //         boton.disabled = false; // Vuelve a habilitar el botón
        //     }
        // });
    
        if (!document.querySelector(`script[src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js"]`)) {
            const bootstrapScript = document.createElement("script");
            bootstrapScript.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js";
            bootstrapScript.defer = true;
            document.body.appendChild(bootstrapScript);
        }
        
        if (!document.querySelector(`script[src="//cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js"]`)) {
            const alertifyScript = document.createElement("script");
            alertifyScript.src = "//cdn.jsdelivr.net/npm/alertifyjs@1.14.0/build/alertify.min.js";
            alertifyScript.defer = true;
            document.body.appendChild(alertifyScript);
        }

    

        async function cargarSeccion(url, scriptPath, funcionCarga) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Error al cargar la sección: ${url}`);
                console.log(url)
                console.log(scriptPath)

        
                const html = await response.text();
                const main = document.querySelector("main");
                    // Comprobar si ya estás en la sección actual para evitar cargarla nuevamente
                if (main.dataset.currentSection === url) {
                    console.log("La sección ya está cargada. No se volverá a cargar.");
                    return;
                }

                
                main.innerHTML = html; // Reemplaza correctamente el contenido
                main.dataset.currentSection = url; // Marca sección actual

        
                // Importar el script de forma segura
                const modulo = await import(scriptPath).catch(error => {
                    console.error('Error al cargar el módulo:', error);
                });
                
        
                // Ejecutar la función de carga solo si existe
                if (modulo && typeof modulo[funcionCarga] === "function") {
                    modulo[funcionCarga]();
                } else {
                    console.error(`La función ${funcionCarga} no se pudo ejecutar.`);
                }
        
            } catch (error) {
                console.error("Error:", error);
                main.innerHTML = `<p>Error al cargar ${url}</p>`;
            }
            // console.log("Contenido actual de main antes de insertar nuevo contenido:", main.innerHTML);

        }
        
        
        // Botón para gestión de usuarios
        document.querySelector(".btnGestionUsuarios").addEventListener("click", async () => {
            await  cargarSeccion("/gestionUsuarios", "/js/gestionUsuarios.js", "cargarUsuarios");
            // Lanza un evento personalizado para notificar que la sección fue cargada
            document.dispatchEvent(new Event("seccionGestionUsuariosCargada"));
        });

        document.querySelector(".btnGestionGaleria").addEventListener("click", async () => {
            await cargarSeccion("/gestionGaleria", "/js/gestionGaleria.js", "cargarGaleria");
        
            // Lanza un evento personalizado para notificar que la sección fue cargada
            document.dispatchEvent(new Event("seccionGestionGaleriaCargada"));
        });

        
        
        // Botón para gestión de galería
        // document.querySelector(".btnGestionGaleria").addEventListener("click", () => {
        //     cargarSeccion("/gestionGaleria", "/js/gestionGaleria.js", "cargarGaleria");
        // });
        

        
        

        
    